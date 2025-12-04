
import {
  WellPlan,
  StockMap,
  SimulationResult,
  WellTypeRequirement,
  MaterialRequirement,
  MaterialComponent,
  MissingItem,
  ProcurementItem,
  MasterMaterial,
  AssignedItem
} from '../types';

export const calculateFeasibility = (
  wellPlan: WellPlan[],
  initialStock: StockMap,
  wellRequirements: WellTypeRequirement[]
): SimulationResult[] => {
  // Deep clone stock to simulate consumption without mutating original state
  const runningStock = { ...initialStock };
  const results: SimulationResult[] = [];

  for (const well of wellPlan) {
    const requirementProfile = wellRequirements.find(
      (r) => r.tipo_pozo === well.type
    );

    if (!requirementProfile) {
      results.push({
        wellId: well.id,
        wellName: well.name,
        wellType: well.type,
        isFeasible: false,
        stageStatus: { GUIA: 'CRITICAL', AISLACION: 'CRITICAL', CABEZAL: 'CRITICAL' },
        missingItems: [],
        assignedItems: []
      });
      continue;
    }

    const assignedItems: AssignedItem[] = [];
    const missingItems: MissingItem[] = [];
    let wellFeasible = true;
    const currentStageStatus: {
      GUIA: 'OK' | 'CRITICAL';
      AISLACION: 'OK' | 'CRITICAL';
      CABEZAL: 'OK' | 'CRITICAL';
    } = {
      GUIA: 'OK',
      AISLACION: 'OK',
      CABEZAL: 'OK',
    };

    // Iterate through all required materials for this well
    for (const matReq of requirementProfile.materiales) {
      const consumptionResult = tryConsumeMaterial(runningStock, matReq);

      // Construct Assigned Item based on simulation result
      const allValidSapCodes = matReq.alternativas.flatMap(a => a.componentes);

      if (!consumptionResult.success) {
        wellFeasible = false;
        const stageKey = matReq.etapa.toUpperCase() as keyof typeof currentStageStatus;
        if (currentStageStatus[stageKey]) {
          currentStageStatus[stageKey] = 'CRITICAL';
        }

        missingItems.push({
          etapa: matReq.etapa,
          materialDescripcion: matReq.descripcion,
          required: matReq.cantidad,
          available: consumptionResult.availableFound,
          deficit: matReq.cantidad - consumptionResult.availableFound,
          sapCodes: allValidSapCodes
        });

        // Add to BOM as Missing
        assignedItems.push({
            etapa: matReq.etapa,
            descripcion: matReq.descripcion,
            cantidad: matReq.cantidad,
            sapCodes: allValidSapCodes,
            usedSapCodes: [], // None consumed
            status: 'MISSING'
        });

      } else {
        // Add to BOM as OK, with the specific codes used
        assignedItems.push({
            etapa: matReq.etapa,
            descripcion: matReq.descripcion,
            cantidad: matReq.cantidad,
            sapCodes: allValidSapCodes,
            usedSapCodes: consumptionResult.usedSapCodes,
            status: 'OK'
        });
      }
    }

    results.push({
      wellId: well.id,
      wellName: well.name,
      wellType: well.type,
      isFeasible: wellFeasible,
      stageStatus: currentStageStatus,
      missingItems,
      assignedItems
    });
  }

  return results;
};

/**
 * Tries to find a valid alternative and consume stock.
 * Returns success status, available amount found, and which SAP codes were consumed.
 * Mutates runningStock if successful.
 */
const tryConsumeMaterial = (
  stock: StockMap,
  req: MaterialRequirement
): { success: boolean; availableFound: number; usedSapCodes: string[] } => {
  
  // 1. Try to find a COMPLETE match first
  for (const alt of req.alternativas) {
    const available = calculateAlternativeAvailability(stock, alt);
    
    if (available >= req.cantidad) {
      consumeAlternative(stock, alt, req.cantidad);
      return { 
          success: true, 
          availableFound: available,
          usedSapCodes: alt.componentes 
      };
    }
  }

  // 2. If no complete match, find the "best" partial availability for reporting
  let maxAvailable = 0;
  for (const alt of req.alternativas) {
    const available = calculateAlternativeAvailability(stock, alt);
    if (available > maxAvailable) maxAvailable = available;
  }

  return { 
      success: false, 
      availableFound: maxAvailable,
      usedSapCodes: [] 
  };
};

const calculateAlternativeAvailability = (stock: StockMap, alt: MaterialComponent): number => {
  if (alt.es_kit) {
    let minQty = Number.MAX_SAFE_INTEGER;
    for (const sap of alt.componentes) {
      const qty = stock[sap] || 0;
      if (qty < minQty) minQty = qty;
    }
    return minQty === Number.MAX_SAFE_INTEGER ? 0 : minQty;
  } else {
    let sum = 0;
    for (const sap of alt.componentes) {
      sum += (stock[sap] || 0);
    }
    return sum;
  }
};

const consumeAlternative = (stock: StockMap, alt: MaterialComponent, amount: number) => {
  for (const sap of alt.componentes) {
    if (stock[sap] !== undefined) {
      stock[sap] = Math.max(0, stock[sap] - amount);
    } else {
       stock[sap] = 0;
    }
  }
};

// --- PROCUREMENT LOGIC ---

export const generateProcurementPlan = (
  simulationResults: SimulationResult[],
  wellPlan: WellPlan[],
  masterMaterials: MasterMaterial[]
): ProcurementItem[] => {
  
  // Map of Material Description -> Procurement Item
  const procurementMap = new Map<string, ProcurementItem>();

  simulationResults.forEach((res, index) => {
    const currentWell = wellPlan[index];
    if (!currentWell) return;

    res.missingItems.forEach(item => {
      const key = item.materialDescripcion;
      
      if (!procurementMap.has(key)) {
        // Initialize procurement entry
        const repSapCode = item.sapCodes[0] || '';
        const masterData = masterMaterials.find(m => m.codigoSAP === repSapCode);
        const leadTime = masterData ? masterData.leadTimeDias : 30; // Default 30 if not found
        const supplier = masterData ? masterData.proveedor : 'Unknown';

        procurementMap.set(key, {
          sapCode: repSapCode,
          description: item.materialDescripcion,
          totalRequired: 0,
          totalAvailable: item.available, // Available at start
          totalDeficit: 0,
          leadTime: leadTime,
          supplier: supplier,
          firstRequiredDate: currentWell.startDate,
          orderDeadline: ''
        });
      }

      const record = procurementMap.get(key)!;
      
      // Update totals
      record.totalDeficit += item.deficit;
      record.totalRequired += item.required;

      // Update Dates
      if (new Date(currentWell.startDate) < new Date(record.firstRequiredDate)) {
        record.firstRequiredDate = currentWell.startDate;
      }
    });
  });

  // Calculate deadlines
  return Array.from(procurementMap.values()).map(item => {
    const reqDate = new Date(item.firstRequiredDate);
    reqDate.setDate(reqDate.getDate() - item.leadTime);
    
    return {
      ...item,
      orderDeadline: reqDate.toISOString().split('T')[0]
    };
  });
};
