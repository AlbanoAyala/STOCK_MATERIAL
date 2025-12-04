
// Static Data Types
export interface MasterMaterial {
    codigoSAP: string;
    descripcion: string;
    proveedor: string;
    codigoOracle: string;
    leadTimeDias: number;
}

export interface MaterialComponent {
    es_kit: boolean;
    componentes: string[]; // List of SAP Codes
}

export interface MaterialRequirement {
    etapa: string;
    descripcion: string;
    cantidad: number;
    alternativas: MaterialComponent[];
}

export interface WellTypeRequirement {
    tipo_pozo: string;
    materiales: MaterialRequirement[];
}

// Runtime Data Types
export interface StockItem {
    sapCode: string;
    quantity: number;
    source: 'SAP' | 'TENARIS' | 'CONSOLIDATED';
}

export interface StockMap {
    [sapCode: string]: number;
}

export interface WellPlan {
    id: string;
    name: string;
    type: string;
    startDate: string; // YYYY-MM-DD
}

// Simulation Results Types
export interface MissingItem {
    etapa: string;
    materialDescripcion: string;
    required: number;
    available: number;
    deficit: number;
    sapCodes: string[];
}

export interface AssignedItem {
    etapa: string;
    descripcion: string;
    cantidad: number;
    sapCodes: string[]; // All valid options
    usedSapCodes: string[]; // The specific codes actually consumed/locked
    status: 'OK' | 'MISSING';
}

export interface SimulationResult {
    wellId: string;
    wellName: string;
    wellType: string;
    isFeasible: boolean;
    stageStatus: {
        GUIA: 'OK' | 'CRITICAL';
        AISLACION: 'OK' | 'CRITICAL';
        CABEZAL: 'OK' | 'CRITICAL';
    };
    missingItems: MissingItem[];
    assignedItems: AssignedItem[];
}

export interface ProcurementItem {
    sapCode: string; // Main representative code or kit description
    description: string;
    totalRequired: number;
    totalAvailable: number;
    totalDeficit: number;
    leadTime: number;
    firstRequiredDate: string;
    orderDeadline: string;
    supplier: string;
}
