
// Raw Data from Excel - SAP
export interface SapRow {
  Material: string | number;
  "Texto breve de material": string; // Description
  Centro?: string; // Warehouse code usually here or Almacén
  "Almacén"?: string;
  "Libre utilización": number; // Quantity
  Proveedor?: string;
  [key: string]: any;
}

// Raw Data from Excel - Activity
export interface ActivityRow {
  Pozo: string;
  "Pozo tipo": string;
  Fecha: string | number; // Excel date serial or string
  Hecho: string; // "Sí" or "No"
  [key: string]: any;
}

// Processed Stock Item
export interface StockItem {
  code: string;
  description: string;
  warehouseGroup: 'GSJ' | 'CA' | 'OTRO';
  originalWarehouse: string;
  supplier: string;
  quantity: number;
  wellTypeTag?: string; // Derived from description or mapping if needed
}

// --- JSON STRUCTURE INTERFACES (Editable DBs) ---

// 1. Material Filter List (The Flat List)
export interface JsonSapFilter {
  codigo_sap: string;
  descripcion: string;
  categoria: string;
}

// 2. Requirements per Well Type (The Complex Nested List)
export interface JsonMaterialVariant {
  es_kit: boolean;
  componentes: string[];
}

export interface JsonMaterialRequirement {
  etapa: string; // "GUIA" | "AISLACION" | "CABEZAL"
  descripcion: string;
  alternativas: JsonMaterialVariant[];
}

export interface JsonWellTypeDefinition {
  tipo_pozo: string;
  materiales: JsonMaterialRequirement[];
}

// Analysis Result for a single Well
export interface WellAnalysis {
  wellName: string;
  wellType: string;
  wellGroup: string; // Convencional, NOC Premium, etc.
  date: string;
  sectionGuiaStatus: 'OK' | 'FAIL';
  sectionAislacionStatus: 'OK' | 'FAIL';
  missingMaterials: Array<{
    code: string;
    description: string;
    required: number;
    missing: number;
    section: string; // 'Guía' | 'Aislación' etc
  }>;
  canDrillFull: boolean;
}

export interface GlobalAnalysis {
  wells: WellAnalysis[];
  totalFullWellsPossible: number;
  totalGuiaPossible: number;
  totalAislacionPossible: number;
  consolidatedMissing: Array<{
    code: string;
    description: string;
    supplier: string;
    totalMissing: number;
  }>;
}
