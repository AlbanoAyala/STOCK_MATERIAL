
import React, { useState, useEffect } from 'react';
import { Layers, Database, Activity, RefreshCw, Settings2 } from 'lucide-react';
import DropZone from './components/DropZone';
import StockTab from './components/StockTab';
import ActivityTab from './components/ActivityTab';
import ManagementTab from './components/ManagementTab';
import { 
  readExcelFile, 
  processStockData, 
  processActivityData, 
  analyzeFeasibility, 
  generateMockStock, 
  generateMockActivity,
  getInitialMaterialsDB,
  getInitialRequirementsDB
} from './services/excelService';
import { StockItem, GlobalAnalysis, JsonSapFilter, JsonWellTypeDefinition } from './types';

function App() {
  const [activeTab, setActiveTab] = useState<'stock' | 'activity' | 'management'>('stock');
  const [stockFile, setStockFile] = useState<File | null>(null);
  const [activityFile, setActivityFile] = useState<File | null>(null);
  
  const [processedStock, setProcessedStock] = useState<StockItem[]>([]);
  const [analysis, setAnalysis] = useState<GlobalAnalysis | null>(null);
  
  // --- APP STATE: Editable Databases ---
  const [materialsDB, setMaterialsDB] = useState<JsonSapFilter[]>(getInitialMaterialsDB());
  const [requirementsDB, setRequirementsDB] = useState<JsonWellTypeDefinition[]>(getInitialRequirementsDB());
  // -------------------------------------

  const [isLoading, setIsLoading] = useState(false);
  const [isDataReady, setIsDataReady] = useState(false);
  const [rawDataStock, setRawDataStock] = useState<any[]>([]);
  const [rawDataActivity, setRawDataActivity] = useState<any[]>([]);

  // Process Data whenever Files OR Databases change
  useEffect(() => {
    const processData = () => {
      if (rawDataStock.length === 0 || rawDataActivity.length === 0) return;

      // 2. Process Stock (Filter & Group) - PASSING materialsDB
      const stock = processStockData(rawDataStock, materialsDB);
      setProcessedStock(stock);

      // 3. Process Activity (Filter & Sort)
      const activity = processActivityData(rawDataActivity);

      // 4. Analyze - PASSING requirementsDB
      const result = analyzeFeasibility(stock, activity, requirementsDB);
      setAnalysis(result);
    };

    processData();
  }, [rawDataStock, rawDataActivity, materialsDB, requirementsDB]);

  // File Reader Effect
  useEffect(() => {
    const readFiles = async () => {
      if (!stockFile || !activityFile) return;

      setIsLoading(true);
      try {
        const rStock = await readExcelFile(stockFile);
        const rActivity = await readExcelFile(activityFile);
        
        setRawDataStock(rStock);
        setRawDataActivity(rActivity);
        
        setIsDataReady(true);
      } catch (error) {
        console.error("Error processing files:", error);
        alert("Hubo un error al procesar los archivos. Asegúrate de que el formato sea correcto.");
      } finally {
        setIsLoading(false);
      }
    };

    readFiles();
  }, [stockFile, activityFile]);

  const loadDemoData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setRawDataStock(generateMockStock());
      setRawDataActivity(generateMockActivity());
      
      setIsDataReady(true);
      setStockFile(new File([], "Demo_SAP_Stock.xlsx"));
      setActivityFile(new File([], "Demo_Plan_Anual.xlsx"));
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="flex min-h-screen w-full bg-slate-100">
      
      {/* Sidebar */}
      <aside className="w-80 bg-slate-900 text-slate-300 flex flex-col shadow-2xl z-20 sticky top-0 h-screen overflow-y-auto">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3 text-white mb-1">
            <Database className="w-8 h-8 text-blue-500" />
            <h1 className="text-xl font-bold tracking-tight">DrillStock</h1>
          </div>
          <p className="text-xs text-slate-500">Control de Materiales de Pozo</p>
        </div>

        <div className="p-6 space-y-8 flex-1">
          {/* File Upload Section */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">Carga de Datos</h2>
            
            <DropZone 
              label="Stock SAP (.xlsx)" 
              onFileLoaded={setStockFile} 
              isLoaded={!!stockFile} 
              fileName={stockFile?.name}
            />
            
            <DropZone 
              label="Actividad Año (.xlsx)" 
              onFileLoaded={setActivityFile} 
              isLoaded={!!activityFile} 
              fileName={activityFile?.name}
            />
          </div>

           {/* Demo Button */}
           {!isDataReady && (
            <div className="pt-4 border-t border-slate-800">
              <button 
                onClick={loadDemoData}
                className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-lg text-sm transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Cargar Datos Demo
              </button>
            </div>
           )}

          {/* Navigation (Only active when data is ready) */}
          {isDataReady && (
            <div className="space-y-2 pt-6 border-t border-slate-800 animate-fadeIn">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">Navegación</h2>
              <button
                onClick={() => setActiveTab('stock')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeTab === 'stock' 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                    : 'hover:bg-slate-800'
                }`}
              >
                <Layers className="w-5 h-5" />
                <span className="font-medium">Stock de Materiales</span>
              </button>
              
              <button
                onClick={() => setActiveTab('activity')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeTab === 'activity' 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                    : 'hover:bg-slate-800'
                }`}
              >
                <Activity className="w-5 h-5" />
                <span className="font-medium">Actividad Posible</span>
              </button>

              <div className="pt-4 mt-4 border-t border-slate-800/50">
                 <button
                  onClick={() => setActiveTab('management')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === 'management' 
                      ? 'bg-amber-600 text-white shadow-lg shadow-amber-900/50' 
                      : 'hover:bg-slate-800 text-amber-100/70'
                  }`}
                >
                  <Settings2 className="w-5 h-5" />
                  <span className="font-medium">Gestión de Datos</span>
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 bg-slate-950 text-xs text-slate-600 border-t border-slate-900">
          <p>v1.1.0 &copy; 2023</p>
          <p>Sistema de Gestión de Perforación</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden h-screen flex flex-col">
        <header className="bg-white h-20 shadow-sm border-b border-slate-200 flex items-center px-8 justify-between sticky top-0 z-10 shrink-0">
          <h2 className="text-2xl font-bold text-slate-800">
            {activeTab === 'stock' && 'Inventario de Materiales'}
            {activeTab === 'activity' && 'Planificación de Actividad'}
            {activeTab === 'management' && 'Gestión y Configuración'}
          </h2>
          {isDataReady && (
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Sistema Sincronizado
            </div>
          )}
        </header>

        <div className="p-8 overflow-y-auto flex-1">
          {!isDataReady ? (
            <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400 space-y-4">
              {isLoading ? (
                <RefreshCw className="w-12 h-12 animate-spin text-blue-500" />
              ) : (
                <Database className="w-16 h-16 opacity-20" />
              )}
              <p className="text-lg font-medium">
                {isLoading ? 'Procesando archivos...' : 'Sube los archivos Excel para comenzar o carga la demo.'}
              </p>
            </div>
          ) : (
            <>
              {activeTab === 'stock' && <StockTab stock={processedStock} />}
              {activeTab === 'activity' && analysis && <ActivityTab analysis={analysis} />}
              {activeTab === 'management' && (
                <ManagementTab 
                  materialsDB={materialsDB}
                  setMaterialsDB={setMaterialsDB}
                  requirementsDB={requirementsDB}
                  setRequirementsDB={setRequirementsDB}
                />
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
