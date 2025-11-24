
import * as XLSX from 'xlsx';
import { ActivityRow, GlobalAnalysis, SapRow, StockItem, WellAnalysis, JsonSapFilter, JsonWellTypeDefinition } from '../types';
import { WAREHOUSE_GROUPS, WELL_GROUPS_MAPPING, MATERIALS_DB, WELL_REQUIREMENTS_DB } from '../constants';

// --- File Reading Helpers ---

export const readExcelFile = (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result;
      if (data) {
        const workbook = XLSX.read(data, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        resolve(jsonData);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsBinaryString(file);
  });
};

// --- Logic Helpers ---

// 1. Process Stock
// Modified to accept dynamic materialsDB
export const processStockData = (rawData: SapRow[], materialsDB: JsonSapFilter[]): StockItem[] => {
  // Create a Set of valid codes for O(1) lookup
  const validCodes = new Set(materialsDB.map(m => m.codigo_sap));

  const filtered = rawData.filter(row => {
    const code = String(row.Material).trim();
    return validCodes.has(code);
  });

  return filtered.map(row => {
    const warehouse = String(row.Almacén || row.Centro || "").toUpperCase();
    let group: 'GSJ' | 'CA' | 'OTRO' = 'OTRO';

    if (WAREHOUSE_GROUPS.GSJ.includes(warehouse)) group = 'GSJ';
    else if (WAREHOUSE_GROUPS.CA.includes(warehouse)) group = 'CA';

    // Try to find description in our DB if missing in Excel, or use Excel's
    const dbEntry = materialsDB.find(m => m.codigo_sap === String(row.Material));
    
    return {
      code: String(row.Material),
      description: row["Texto breve de material"] || dbEntry?.descripcion || "Unknown",
      originalWarehouse: warehouse,
      warehouseGroup: group,
      quantity: Number(row["Libre utilización"] || 0),
      supplier: row.Proveedor || "S/D"
    };
  });
};

// 2. Process Activity
export const processActivityData = (rawData: ActivityRow[]): ActivityRow[] => {
  return rawData.filter(row => {
    const done = String(row.Hecho || "").trim().toLowerCase();
    return done === 'no';
  }).sort((a, b) => {
    // Sort by Date (assuming simple logic or numbers)
    return Number(a.Fecha) - Number(b.Fecha);
  });
};

// 3. The Core Analysis Logic
// Modified to accept dynamic requirementsDB
export const analyzeFeasibility = (
  stock: StockItem[], 
  wells: ActivityRow[],
  requirementsDB: JsonWellTypeDefinition[]
): GlobalAnalysis => {
  
  // Create a mutable copy of stock to simulate depletion
  // Map<Code, { qty, desc, supplier }>
  const runningStock = new Map<string, { qty: number, desc: string, supplier: string }>();
  
  // Aggregate initial stock by material code
  stock.forEach(item => {
    const current = runningStock.get(item.code) || { qty: 0, desc: item.description, supplier: item.supplier };
    current.qty += item.quantity;
    runningStock.set(item.code, current);
  });

  const analysisResults: WellAnalysis[] = [];
  let countFullWells = 0;
  let countGuia = 0;
  let countAislacion = 0;
  const globalMissing = new Map<string, { code: string, desc: string, supplier: string, count: number }>();

  wells.forEach(well => {
    const wType = String(well["Pozo tipo"]).trim();
    const wName = well.Pozo;
    
    // Find the requirement definition for this well type
    // If exact match not found, try to match partial or default to first one
    const wellDef = requirementsDB.find(r => r.tipo_pozo === wType) || requirementsDB[0];

    let guiaPossible = true;
    let aislacionPossible = true;
    const wellMissing: WellAnalysis['missingMaterials'] = [];

    // Helper to check requirement
    const checkRequirements = (sectionFilter: string): boolean => {
      let sectionOk = true;
      const sectionReqs = wellDef.materiales.filter(m => m.etapa === sectionFilter);
      
      sectionReqs.forEach(req => {
        // We need to find ONE valid alternative that has stock
        let bestAlternativeIndex = -1;

        // Iterate alternatives to find one that satisfies stock
        for (let i = 0; i < req.alternativas.length; i++) {
          const alt = req.alternativas[i];
          let altPossible = true;
          
          // Check all components of this alternative
          for (const compCode of alt.componentes) {
            const currentStock = runningStock.get(compCode)?.qty || 0;
            if (currentStock < 1) {
              altPossible = false;
              break;
            }
          }

          if (altPossible) {
            bestAlternativeIndex = i;
            break; // Found a working alternative
          }
        }

        if (bestAlternativeIndex !== -1) {
          // Decrease stock for the chosen alternative
          const chosenAlt = req.alternativas[bestAlternativeIndex];
          chosenAlt.componentes.forEach(compCode => {
             const stockEntry = runningStock.get(compCode);
             if (stockEntry) {
               stockEntry.qty -= 1;
             }
          });
        } else {
          // No alternative found
          sectionOk = false;
          
          const preferredAlt = req.alternativas[0];
          const preferredCode = preferredAlt?.componentes.join(" + ") || "N/A";
          
          wellMissing.push({
            code: preferredCode,
            description: req.descripcion,
            required: 1,
            missing: 1,
            section: sectionFilter === 'GUIA' ? 'Guía' : 'Aislación'
          });

          // Update global missing stats
          const key = req.descripcion; 
          const existing = globalMissing.get(key) || { 
            code: preferredCode, 
            desc: req.descripcion, 
            supplier: "Varios", 
            count: 0 
          };
          existing.count += 1;
          globalMissing.set(key, existing);
        }
      });
      return sectionOk;
    };

    // Check Guia
    guiaPossible = checkRequirements('GUIA');
    
    // Check Aislacion
    aislacionPossible = checkRequirements('AISLACION');

    if (guiaPossible) countGuia++;
    if (aislacionPossible) countAislacion++;
    if (guiaPossible && aislacionPossible) countFullWells++;

    analysisResults.push({
      wellName: wName,
      wellType: wType,
      wellGroup: WELL_GROUPS_MAPPING[wType] || "Convencional",
      date: typeof well.Fecha === 'number' ? new Date((well.Fecha - (25567 + 2))*86400*1000).toLocaleDateString() : String(well.Fecha),
      sectionGuiaStatus: guiaPossible ? 'OK' : 'FAIL',
      sectionAislacionStatus: aislacionPossible ? 'OK' : 'FAIL',
      missingMaterials: wellMissing,
      canDrillFull: guiaPossible && aislacionPossible
    });
  });

  return {
    wells: analysisResults,
    totalFullWellsPossible: countFullWells,
    totalGuiaPossible: countGuia,
    totalAislacionPossible: countAislacion,
    consolidatedMissing: Array.from(globalMissing.entries()).map(([key, val]) => ({
      code: val.code,
      description: val.desc,
      supplier: val.supplier,
      totalMissing: val.count
    }))
  };
};

// Helpers to load initial data (for App.tsx)
export const getInitialMaterialsDB = () => [...MATERIALS_DB];
export const getInitialRequirementsDB = () => [...WELL_REQUIREMENTS_DB];

// Mock data generator 
export const generateMockStock = (): SapRow[] => {
  return MATERIALS_DB.map((m, index) => ({
    Material: m.codigo_sap,
    "Texto breve de material": m.descripcion,
    "Almacén": index % 2 === 0 ? "CS01" : "B001",
    "Libre utilización": Math.floor(Math.random() * 10), 
    Proveedor: "Demo Supplier"
  }));
};

export const generateMockActivity = (): ActivityRow[] => [
  { Pozo: "POZO-101", "Pozo tipo": "Convencional", Fecha: 45300, Hecho: "No" },
  { Pozo: "POZO-102", "Pozo tipo": "NOC Premium + DwC", Fecha: 45310, Hecho: "No" },
  { Pozo: "POZO-103", "Pozo tipo": "NOC BTC", Fecha: 45320, Hecho: "No" },
  { Pozo: "POZO-104", "Pozo tipo": "Convencional", Fecha: 45325, Hecho: "No" },
];
