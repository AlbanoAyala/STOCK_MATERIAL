
import React, { useState } from 'react';
import { JsonSapFilter, JsonWellTypeDefinition, JsonMaterialRequirement } from '../types';
import { Plus, Trash2, Save, Database, Settings, Search, ChevronDown, ChevronRight, X } from 'lucide-react';

interface ManagementTabProps {
  materialsDB: JsonSapFilter[];
  setMaterialsDB: React.Dispatch<React.SetStateAction<JsonSapFilter[]>>;
  requirementsDB: JsonWellTypeDefinition[];
  setRequirementsDB: React.Dispatch<React.SetStateAction<JsonWellTypeDefinition[]>>;
}

const ManagementTab: React.FC<ManagementTabProps> = ({
  materialsDB,
  setMaterialsDB,
  requirementsDB,
  setRequirementsDB,
}) => {
  const [activeSection, setActiveSection] = useState<'materials' | 'wells'>('materials');

  return (
    <div className="space-y-6 animate-fadeIn pb-10">
      {/* Sub-Navigation */}
      <div className="flex gap-4 bg-white p-2 rounded-xl shadow-sm border border-slate-200 w-fit mx-auto">
        <button
          type="button"
          onClick={() => setActiveSection('materials')}
          className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all ${
            activeSection === 'materials'
              ? 'bg-blue-100 text-blue-700 shadow-inner'
              : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          <Database className="w-4 h-4" />
          Base de Materiales (SAP)
        </button>
        <button
          type="button"
          onClick={() => setActiveSection('wells')}
          className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all ${
            activeSection === 'wells'
              ? 'bg-blue-100 text-blue-700 shadow-inner'
              : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          <Settings className="w-4 h-4" />
          Configuración de Pozos
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden min-h-[600px]">
        {activeSection === 'materials' ? (
          <MaterialsEditor materials={materialsDB} setMaterials={setMaterialsDB} />
        ) : (
          <WellsEditor requirements={requirementsDB} setRequirements={setRequirementsDB} />
        )}
      </div>
    </div>
  );
};

// --- SUB-COMPONENT: SAP Materials Editor ---

const MaterialsEditor = ({
  materials,
  setMaterials,
}: {
  materials: JsonSapFilter[];
  setMaterials: React.Dispatch<React.SetStateAction<JsonSapFilter[]>>;
}) => {
  const [search, setSearch] = useState('');
  const [newMaterial, setNewMaterial] = useState<JsonSapFilter>({
    codigo_sap: '',
    descripcion: '',
    categoria: 'Consumible',
  });

  const filteredMaterials = materials.filter(
    (m) =>
      m.codigo_sap.includes(search) ||
      m.descripcion.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    if (!newMaterial.codigo_sap || !newMaterial.descripcion) return;
    if (materials.some((m) => m.codigo_sap === newMaterial.codigo_sap)) {
      alert('Este código SAP ya existe en la lista.');
      return;
    }
    setMaterials(prev => [newMaterial, ...prev]);
    setNewMaterial({ codigo_sap: '', descripcion: '', categoria: 'Consumible' });
  };

  const handleDelete = (code: string) => {
    // Removed confirm() to ensure action triggers immediately and avoids browser blocking
    setMaterials(prev => prev.filter((m) => m.codigo_sap !== code));
  };

  // Updated Input Style: Soft Gray Background (slate-100) -> White on Focus
  const inputStyle = "w-full px-4 py-3 border border-slate-200 rounded-lg text-sm bg-slate-100 text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all";

  return (
    <div className="flex flex-col h-full">
      {/* Add Section */}
      <div className="p-6 border-b border-slate-200 bg-white">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5 text-emerald-600" />
          Agregar Nuevo Material a Filtro
        </h3>
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Código SAP</label>
            <input
              value={newMaterial.codigo_sap}
              onChange={(e) => setNewMaterial({ ...newMaterial, codigo_sap: e.target.value })}
              className={inputStyle}
              placeholder="Ej: 02050588"
            />
          </div>
          <div className="flex-[2] w-full">
            <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Descripción</label>
            <input
              value={newMaterial.descripcion}
              onChange={(e) => setNewMaterial({ ...newMaterial, descripcion: e.target.value })}
              className={inputStyle}
              placeholder="Ej: Zapato Guia..."
            />
          </div>
          <div className="flex-1 w-full">
            <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Categoría</label>
            <select
              value={newMaterial.categoria}
              onChange={(e) => setNewMaterial({ ...newMaterial, categoria: e.target.value })}
              className={`${inputStyle} appearance-none`}
            >
              <option value="Convencional">Convencional</option>
              <option value="NOC">NOC</option>
              <option value="Consumible">Consumible</option>
              <option value="Desarrollo">Desarrollo</option>
              <option value="Equipo">Equipo</option>
            </select>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            className="h-[46px] bg-emerald-600 hover:bg-emerald-700 text-white px-6 rounded-lg flex items-center gap-2 transition-colors font-medium shadow-sm shrink-0"
          >
            <Plus className="w-5 h-5" />
            Agregar
          </button>
        </div>
      </div>

      {/* Search Bar - Enhanced Height and Visibility */}
      <div className="p-6 bg-slate-50 border-b border-slate-200">
        <div className="bg-white rounded-xl border border-slate-300 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all overflow-hidden">
            <div className="flex items-center px-4 h-14 gap-3">
                <Search className="w-6 h-6 text-slate-400 shrink-0" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar material por código o descripción..."
                  className="flex-1 bg-transparent outline-none text-lg text-slate-700 placeholder-slate-400 h-full"
                />
                {search && (
                    <button 
                      type="button"
                      onClick={() => setSearch('')} 
                      className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto max-h-[500px] bg-white">
        <table className="min-w-full divide-y divide-slate-100">
          <thead className="bg-slate-50 sticky top-0 shadow-sm z-10">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Código SAP</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Descripción</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Categoría</th>
              <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredMaterials.map((m) => (
              <tr key={m.codigo_sap} className="hover:bg-blue-50/50 group transition-colors">
                <td className="px-6 py-4 text-sm font-mono font-medium text-slate-700">{m.codigo_sap}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{m.descripcion}</td>
                <td className="px-6 py-4 text-sm">
                  <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium border border-slate-200">
                    {m.categoria}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    type="button"
                    onClick={() => handleDelete(m.codigo_sap)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    title="Eliminar Material"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {filteredMaterials.length === 0 && (
                <tr>
                    <td colSpan={4} className="text-center py-12 text-slate-400">
                        No se encontraron materiales.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- SUB-COMPONENT: Well Requirements Editor ---

const WellsEditor = ({
  requirements,
  setRequirements,
}: {
  requirements: JsonWellTypeDefinition[];
  setRequirements: React.Dispatch<React.SetStateAction<JsonWellTypeDefinition[]>>;
}) => {
  // Form State
  const [selectedWellType, setSelectedWellType] = useState(requirements[0]?.tipo_pozo || '');
  const [selectedStage, setSelectedStage] = useState('GUIA');
  const [description, setDescription] = useState('');
  const [sapCodes, setSapCodes] = useState('');

  // Computed derived state for current selection
  const currentWellIndex = requirements.findIndex((r) => r.tipo_pozo === selectedWellType);
  
  // Get unique existing descriptions for autocomplete
  const existingDescriptions = Array.from(
    new Set(
      requirements
        .find((r) => r.tipo_pozo === selectedWellType)
        ?.materiales.filter((m) => m.etapa === selectedStage)
        .map((m) => m.descripcion) || []
    )
  );

  const handleAddRequirement = () => {
    if (!selectedWellType || !description || !sapCodes) {
        alert("Por favor completa todos los campos");
        return;
    }

    setRequirements(prev => {
        // Deep Copy Logic
        const newDb = [...prev];
        let wellIdx = newDb.findIndex((w) => w.tipo_pozo === selectedWellType);

        if (wellIdx === -1) {
            newDb.push({ tipo_pozo: selectedWellType, materiales: [] });
            wellIdx = newDb.length - 1;
        }

        // Clone the well object to allow mutation of its properties
        const well = { ...newDb[wellIdx] };
        well.materiales = [...well.materiales];
        
        const components = sapCodes.split(',').map((s) => s.trim()).filter(Boolean);
        const isKit = components.length > 1;

        const existingReqIndex = well.materiales.findIndex(
            (m) => m.etapa === selectedStage && m.descripcion === description
        );

        if (existingReqIndex > -1) {
            // Clone the specific requirement
            const req = { ...well.materiales[existingReqIndex] };
            req.alternativas = [...req.alternativas, {
                es_kit: isKit,
                componentes: components
            }];
            well.materiales[existingReqIndex] = req;
        } else {
            well.materiales.push({
                etapa: selectedStage,
                descripcion: description,
                alternativas: [{
                    es_kit: isKit,
                    componentes: components
                }]
            });
        }

        // Place back modified well
        newDb[wellIdx] = well;
        return newDb;
    });
    
    setSapCodes(''); // Clear codes after add, keep other context
  };

  const handleDeleteAlternative = (wellIdx: number, reqIdx: number, altIdx: number) => {
      // Removed confirm() for better UX in webviews/embedded contexts
      setRequirements(prev => {
          // Deep Copy for Immutable Update
          const newDb = [...prev];
          
          // Clone Well
          const well = { ...newDb[wellIdx] };
          well.materiales = [...well.materiales];

          // Clone Requirement
          const req = { ...well.materiales[reqIdx] };
          req.alternativas = [...req.alternativas];

          // Mutate the clone
          req.alternativas.splice(altIdx, 1);

          // Update structure
          if (req.alternativas.length === 0) {
              // If no alternatives left, remove the requirement completely
              well.materiales.splice(reqIdx, 1);
          } else {
              // Otherwise update the requirement
              well.materiales[reqIdx] = req;
          }

          // Update Well in DB
          newDb[wellIdx] = well;
          
          return newDb;
      });
  };

  // Updated Input Style: Soft Gray Background (slate-100)
  const inputStyle = "w-full px-4 py-3 border border-slate-200 rounded-lg text-sm bg-slate-100 text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all";

  return (
    <div className="flex flex-col lg:flex-row h-full">
      {/* LEFT: Form to Add */}
      <div className="lg:w-1/3 p-6 border-r border-slate-200 bg-white h-full overflow-y-auto">
        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Plus className="w-5 h-5 text-blue-600" />
            Agregar / Editar Material
        </h3>
        
        <div className="space-y-5">
            {/* 1. Select Well Type */}
            <div>
                <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">1. Pozo Tipo</label>
                <div className="relative">
                    <select
                        value={selectedWellType}
                        onChange={(e) => setSelectedWellType(e.target.value)}
                        className={`${inputStyle} appearance-none`}
                    >
                        {requirements.map(r => (
                            <option key={r.tipo_pozo} value={r.tipo_pozo}>{r.tipo_pozo}</option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
            </div>

            {/* 2. Select Stage */}
            <div>
                <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">2. Sección (Etapa)</label>
                <div className="relative">
                    <select
                        value={selectedStage}
                        onChange={(e) => setSelectedStage(e.target.value)}
                        className={`${inputStyle} appearance-none`}
                    >
                        <option value="GUIA">GUIA</option>
                        <option value="AISLACION">AISLACION</option>
                        <option value="CABEZAL">CABEZAL</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
            </div>

            {/* 3. Description (Dropdown or Input) */}
            <div>
                <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">3. Descripción del Material</label>
                <input
                    list="descriptions-list"
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ej: Zapato 9-5/8..."
                    className={inputStyle}
                />
                <datalist id="descriptions-list">
                    {existingDescriptions.map((d, i) => <option key={i} value={d} />)}
                </datalist>
                <p className="text-xs text-slate-400 mt-1">Selecciona de la lista para agregar una alternativa, o escribe uno nuevo.</p>
            </div>

            {/* 4. SAP Codes */}
            <div>
                <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">4. Código(s) SAP</label>
                <input
                    type="text"
                    value={sapCodes}
                    onChange={(e) => setSapCodes(e.target.value)}
                    placeholder="Ej: 02050699, 02120029"
                    className={`${inputStyle} font-mono`}
                />
                <p className="text-xs text-slate-400 mt-1">Para Kits, separar códigos con comas.</p>
            </div>

            <button 
                type="button"
                onClick={handleAddRequirement}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-md transition-all flex justify-center items-center gap-2 mt-4"
            >
                <Save className="w-4 h-4" />
                Guardar Material
            </button>

        </div>
      </div>

      {/* RIGHT: Visualization Tree */}
      <div className="flex-1 bg-slate-50 p-6 overflow-y-auto max-h-[800px]">
          <h4 className="font-bold text-slate-700 mb-4 border-b border-slate-200 pb-2 flex items-center justify-between">
              <span>Estructura Actual: {selectedWellType}</span>
              <span className="text-xs font-normal text-slate-500 bg-white px-2 py-1 rounded border border-slate-200">
                  Visualizando material requerido
              </span>
          </h4>

          {currentWellIndex > -1 && (
              <div className="space-y-6">
                  {['GUIA', 'AISLACION', 'CABEZAL'].map(stage => {
                      const stageReqs = requirements[currentWellIndex].materiales.filter(m => m.etapa === stage);
                      if (stageReqs.length === 0) return null;

                      return (
                          <div key={stage} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                              <div className="flex items-center gap-2 mb-4">
                                <span className="w-2 h-6 bg-blue-500 rounded-sm"></span>
                                <h5 className="text-sm font-bold text-slate-700 uppercase tracking-wider">{stage}</h5>
                              </div>
                              
                              <div className="space-y-4 pl-2">
                                  {stageReqs.map((req) => {
                                      // Find actual index in main array strictly by object reference.
                                      // This is safe because 'req' is a direct reference from the filtered array.
                                      const actualReqIdx = requirements[currentWellIndex].materiales.indexOf(req);

                                      return (
                                          <div key={actualReqIdx} className="pl-4 border-l-2 border-slate-100 hover:border-blue-200 transition-colors">
                                              <div className="flex items-center justify-between mb-2">
                                                  <span className="text-sm font-semibold text-slate-800">{req.descripcion}</span>
                                              </div>
                                              
                                              <div className="space-y-2">
                                                  {req.alternativas.map((alt, altIdx) => (
                                                      <div key={altIdx} className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 text-xs hover:bg-white hover:shadow-sm transition-all group">
                                                          <div className="flex items-center gap-3">
                                                              {alt.es_kit ? (
                                                                  <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-[10px] font-bold tracking-wide">KIT</span>
                                                              ) : (
                                                                  <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold tracking-wide">ITEM</span>
                                                              )}
                                                              <span className="font-mono text-slate-600 text-sm">{alt.componentes.join(' + ')}</span>
                                                          </div>
                                                          <button 
                                                            type="button"
                                                            onClick={(e) => {
                                                              e.stopPropagation();
                                                              handleDeleteAlternative(currentWellIndex, actualReqIdx, altIdx);
                                                            }}
                                                            className="text-slate-300 hover:text-red-500 hover:bg-red-50 p-1 rounded transition-colors"
                                                            title="Eliminar opción"
                                                          >
                                                              <X className="w-4 h-4" />
                                                          </button>
                                                      </div>
                                                  ))}
                                              </div>
                                          </div>
                                      );
                                  })}
                              </div>
                          </div>
                      );
                  })}
              </div>
          )}
      </div>
    </div>
  );
};

export default ManagementTab;
