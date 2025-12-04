import React, { useState, useEffect, useMemo } from 'react';
import FileUploader from './components/FileUploader';
import WellPlanner from './components/WellPlanner';
import TrafficLight from './components/TrafficLight';
import DetailModal from './components/DetailModal';
import { MASTER_MATERIALS, WELL_REQUIREMENTS } from './constants';
import { StockMap, WellPlan, SimulationResult, ProcurementItem } from './types';
import { calculateFeasibility, generateProcurementPlan } from './services/logic';
import { LayoutDashboard, Package, ShoppingCart, CalendarClock, Search, PanelLeftClose, PanelLeftOpen, Database } from 'lucide-react';

type ActiveTab = 'dashboard' | 'stock' | 'procurement';

const App: React.FC = () => {
  // --- State ---
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const [sapStock, setSapStock] = useState<StockMap>({});
  const [tenarisStock, setTenarisStock] = useState<StockMap>({});
  const [wellPlan, setWellPlan] = useState<WellPlan[]>([]);
  const [simulationResults, setSimulationResults] = useState<SimulationResult[]>([]);
  const [procurementPlan, setProcurementPlan] = useState<ProcurementItem[]>([]);
  const [selectedResult, setSelectedResult] = useState<SimulationResult | null>(null);
  
  // Search state for Consolidated Stock
  const [stockSearchTerm, setStockSearchTerm] = useState('');

  // --- Derived State: Consolidated Stock ---
  const consolidatedStock = useMemo(() => {
    // Whitelist SAP Codes from Master Data
    const validSapCodes = new Set(MASTER_MATERIALS.map(m => m.codigoSAP));
    const stock: StockMap = {};

    const merge = (source: StockMap) => {
      for (const [code, qty] of Object.entries(source)) {
        // Normalize code for comparison
        const normalizedCode = code.trim();
        if (!validSapCodes.has(normalizedCode)) continue; 
        stock[normalizedCode] = (stock[normalizedCode] || 0) + Number(qty);
      }
    };

    merge(sapStock);
    merge(tenarisStock);
    return stock;
  }, [sapStock, tenarisStock]);

  // --- Simulation Trigger ---
  useEffect(() => {
    if (wellPlan.length > 0) {
      const results = calculateFeasibility(wellPlan, consolidatedStock, WELL_REQUIREMENTS);
      setSimulationResults(results);
      
      const procurement = generateProcurementPlan(results, wellPlan, MASTER_MATERIALS);
      setProcurementPlan(procurement);
    } else {
      setSimulationResults([]);
      setProcurementPlan([]);
    }
  }, [wellPlan, consolidatedStock]);

  // --- Handlers ---
  const handleSapUpload = (data: any[]) => {
    const newStock: StockMap = {};
    
    data.forEach(row => {
        // Specific requirement: Code in 'Material' column
        const rawCode = row['Material'];
        const code = rawCode ? String(rawCode).trim() : '';

        if (code) {
             // Look for quantity. SAP often uses 'Libre utilización' or 'Unrestricted'.
             let qty = 0;
             if (row['Libre utilización'] !== undefined) qty = Number(row['Libre utilización']);
             else if (row['Unrestricted'] !== undefined) qty = Number(row['Unrestricted']);
             else if (row['Cantidad'] !== undefined) qty = Number(row['Cantidad']);
             else {
                // Fallback: Find first number value in row
                const val = Object.values(row).find(v => typeof v === 'number');
                qty = Number(val || 0);
             }
             
             newStock[code] = (newStock[code] || 0) + qty;
        }
    });
    setSapStock(newStock);
  };

  const handleTenarisUpload = (data: any[]) => {
      const newStock: StockMap = {};
      data.forEach(row => {
          // Specific requirement: Code in 'Customer Material' column (Column H usually)
          const rawCode = row['Customer Material'];
          const code = rawCode ? String(rawCode).trim() : '';
          
          if (code) {
             // Specific requirement: Stock in 'Prop Customer' column
             const qty = Number(row['Prop Customer'] || 0);

             if (!isNaN(qty)) {
                newStock[code] = (newStock[code] || 0) + qty;
             }
          }
      });
      setTenarisStock(newStock);
  };

  const handlePlanUpload = (data: any[]) => {
      const today = new Date();
      
      const newPlan: WellPlan[] = data.map((row, idx) => {
          const defaultDate = new Date(today);
          defaultDate.setDate(today.getDate() + (idx * 15));
          const defaultDateStr = defaultDate.toISOString().split('T')[0];

          const rawDate = row['Fecha'] || row['Date'];
          let dateStr = '';

          // Logic to handle Excel Serial Date Numbers (e.g., 46113)
          if (typeof rawDate === 'number') {
              const dateObj = new Date(Math.round((rawDate - 25569) * 86400 * 1000));
              if (!isNaN(dateObj.getTime())) {
                  dateStr = dateObj.toISOString().split('T')[0];
              }
          } else if (typeof rawDate === 'string') {
              dateStr = rawDate.trim();
          }

          if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
             const d = new Date(dateStr);
             if (!isNaN(d.getTime())) {
                 dateStr = d.toISOString().split('T')[0];
             } else {
                 dateStr = defaultDateStr;
             }
          }

          return {
            id: `imp-${idx}`,
            name: row['Pozo'] || row['Nombre'] || row['Well'] || `Well ${idx+1}`,
            type: row['Tipo'] || row['Type'] || 'Convencional',
            startDate: dateStr
          };
      }).filter(w => WELL_REQUIREMENTS.some(req => req.tipo_pozo === w.type));
      
      setWellPlan(newPlan);
  };

  return (
    <div className="h-screen bg-gray-100 flex flex-col font-sans text-gray-800 overflow-hidden">
      {/* Navbar */}
      <header className="bg-slate-900 text-white shadow-md z-20 flex-shrink-0">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <LayoutDashboard className="w-6 h-6 text-blue-400" />
                <h1 className="text-xl font-bold tracking-tight">DMMS <span className="text-slate-400 font-normal text-sm hidden md:inline">| Drilling Material Management</span></h1>
            </div>
            
            {/* Tabs */}
            <nav className="flex items-center bg-slate-800 rounded-lg p-1">
                <button 
                    onClick={() => setActiveTab('dashboard')}
                    className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'dashboard' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                >
                    Dashboard
                </button>
                <button 
                     onClick={() => setActiveTab('stock')}
                    className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'stock' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                >
                    Consolidated Stock
                </button>
                <button 
                     onClick={() => setActiveTab('procurement')}
                    className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'procurement' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                >
                    Procurement Plan
                </button>
            </nav>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Collapsible Sidebar for Data Import */}
        <aside 
            className={`${isSidebarOpen ? 'w-80 translate-x-0' : 'w-0 -translate-x-full opacity-0'} 
            bg-white border-r border-gray-200 transition-all duration-300 ease-in-out flex flex-col z-10 absolute md:relative h-full shadow-xl md:shadow-none`}
        >
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 flex-shrink-0">
                <h2 className="font-bold text-gray-700 flex items-center gap-2">
                    <Database className="w-4 h-4" /> Data Import
                </h2>
                <button 
                    onClick={() => setIsSidebarOpen(false)}
                    className="p-1 hover:bg-gray-200 rounded text-gray-500"
                    title="Close Sidebar"
                >
                    <PanelLeftClose className="w-5 h-5" />
                </button>
            </div>
            <div className="p-4 flex flex-col gap-4 overflow-y-auto flex-1">
                <FileUploader 
                    label="SAP Inventory" 
                    onDataLoaded={handleSapUpload} 
                    required 
                    description="Uses 'Material' column."
                    columnsToDetect={['Material']}
                />
                <FileUploader 
                    label="Tenaris Inventory" 
                    onDataLoaded={handleTenarisUpload} 
                    description="Uses 'Customer Material' and 'Prop Customer'."
                    columnsToDetect={['Customer Material', 'Prop Customer']}
                />
                <FileUploader 
                    label="Drilling Plan" 
                    onDataLoaded={handlePlanUpload} 
                    description="Cols: 'Well', 'Type', 'Date'."
                />
                
                <div className="mt-4 p-3 bg-blue-50 text-blue-800 text-xs rounded border border-blue-100">
                    <p className="font-semibold mb-1">Tip:</p>
                    <p>Updating these files will automatically recalculate feasibility for the active plan.</p>
                </div>
            </div>
        </aside>

        {/* Toggle Button (Visible when sidebar closed) */}
        {!isSidebarOpen && (
             <button 
                onClick={() => setIsSidebarOpen(true)} 
                className="absolute left-4 top-4 z-20 bg-white p-2 border border-gray-300 rounded-md shadow-md text-gray-600 hover:text-blue-600 hover:border-blue-400 transition-colors"
                title="Open Data Import"
            >
                <PanelLeftOpen className="w-5 h-5" />
             </button>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-gray-100 p-4 md:p-6">
            
            {/* VIEW: DASHBOARD */}
            {activeTab === 'dashboard' && (
                <div className="h-full flex flex-col">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full min-h-[500px]">
                        
                        {/* Left Column: Well Planner */}
                        <div className="lg:col-span-5 xl:col-span-4 flex flex-col h-full">
                            <WellPlanner 
                                plan={wellPlan} 
                                wellTypes={WELL_REQUIREMENTS} 
                                onPlanChange={setWellPlan} 
                            />
                        </div>

                        {/* Right Column: Feasibility Results */}
                        <div className="lg:col-span-7 xl:col-span-8 flex flex-col h-full">
                            <div className="bg-white rounded-lg shadow border border-gray-200 flex flex-col h-full overflow-hidden">
                                <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center flex-shrink-0">
                                    <h2 className="font-semibold text-lg text-gray-800">Campaign Feasibility</h2>
                                    <div className="text-xs text-gray-500">
                                        {wellPlan.length} wells analyzed
                                    </div>
                                </div>
                                <div className="overflow-y-auto flex-1 p-0">
                                    <table className="w-full text-left border-collapse">
                                        <thead className="sticky top-0 z-10">
                                            <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold tracking-wider">
                                                <th className="px-6 py-3 bg-gray-50">Seq</th>
                                                <th className="px-6 py-3 bg-gray-50">Date</th>
                                                <th className="px-6 py-3 bg-gray-50">Well Name</th>
                                                <th className="px-6 py-3 bg-gray-50 text-center">Guide</th>
                                                <th className="px-6 py-3 bg-gray-50 text-center">Isolation</th>
                                                <th className="px-6 py-3 bg-gray-50 text-center">Head</th>
                                                <th className="px-6 py-3 bg-gray-50 text-center">Overall</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 bg-white">
                                            {simulationResults.length === 0 ? (
                                                <tr>
                                                    <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                                                        <div className="flex flex-col items-center justify-center gap-2">
                                                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-300">
                                                                <Database className="w-6 h-6" />
                                                            </div>
                                                            <p>No data available.</p>
                                                            <p className="text-sm">Import a drilling plan or add wells to start.</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : (
                                                simulationResults.map((result, idx) => {
                                                    const well = wellPlan[idx];
                                                    return (
                                                        <tr 
                                                            key={result.wellId} 
                                                            onClick={() => setSelectedResult(result)}
                                                            className="hover:bg-blue-50 cursor-pointer transition-colors group"
                                                        >
                                                            <td className="px-6 py-4 text-gray-400 font-mono text-sm">{idx + 1}</td>
                                                            <td className="px-6 py-4 text-gray-600 text-sm">{well?.startDate}</td>
                                                            <td className="px-6 py-4 font-medium text-gray-900">
                                                                {result.wellName}
                                                                <div className="text-xs text-gray-400 font-normal">{result.wellType}</div>
                                                            </td>
                                                            <td className="px-6 py-4"><TrafficLight status={result.stageStatus.GUIA} /></td>
                                                            <td className="px-6 py-4"><TrafficLight status={result.stageStatus.AISLACION} /></td>
                                                            <td className="px-6 py-4"><TrafficLight status={result.stageStatus.CABEZAL} /></td>
                                                            <td className="px-6 py-4 text-center">
                                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${result.isFeasible ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                                    {result.isFeasible ? 'GO' : 'NO GO'}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* VIEW: CONSOLIDATED STOCK */}
            {activeTab === 'stock' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-full flex flex-col">
                    <div className="p-6 border-b border-gray-200 bg-gray-50 flex flex-col md:flex-row justify-between items-center gap-4 flex-shrink-0">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <Package className="w-5 h-5 text-blue-600" /> Consolidated Inventory
                        </h2>
                        
                        {/* Search Bar */}
                        <div className="relative w-full md:w-80">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="Search SAP Code or Description..."
                                value={stockSearchTerm}
                                onChange={(e) => setStockSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="overflow-auto flex-1">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-100 text-gray-600 uppercase text-xs sticky top-0 z-10">
                                <tr>
                                    <th className="px-6 py-3 bg-gray-100">SAP Code</th>
                                    <th className="px-6 py-3 bg-gray-100">Description</th>
                                    <th className="px-6 py-3 text-right bg-gray-100">SAP Stock</th>
                                    <th className="px-6 py-3 text-right bg-gray-100">Tenaris Stock</th>
                                    <th className="px-6 py-3 text-right font-bold text-gray-800 bg-gray-100">Total Available</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {MASTER_MATERIALS
                                    .filter(item => {
                                        const term = stockSearchTerm.toLowerCase();
                                        return item.codigoSAP.toLowerCase().includes(term) || 
                                               item.descripcion.toLowerCase().includes(term);
                                    })
                                    .map((item, index) => {
                                        const sapQty = sapStock[item.codigoSAP] || 0;
                                        const tenarisQty = tenarisStock[item.codigoSAP] || 0;
                                        const total = sapQty + tenarisQty;
                                        
                                        // Use explicit description from master data
                                        return (
                                            <tr key={`${item.codigoSAP}-${index}`} className="hover:bg-gray-50">
                                                <td className="px-6 py-3 font-mono text-gray-600">{item.codigoSAP}</td>
                                                <td className="px-6 py-3 text-gray-800 font-medium">{item.descripcion}</td>
                                                <td className="px-6 py-3 text-right text-gray-500">{sapQty}</td>
                                                <td className="px-6 py-3 text-right text-gray-500">{tenarisQty}</td>
                                                <td className="px-6 py-3 text-right font-bold text-blue-700">{total}</td>
                                            </tr>
                                        );
                                    })}
                                {MASTER_MATERIALS.length > 0 && 
                                 MASTER_MATERIALS.filter(item => item.codigoSAP.includes(stockSearchTerm) || item.descripcion.toLowerCase().includes(stockSearchTerm.toLowerCase())).length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                            No materials found matching "{stockSearchTerm}"
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* VIEW: PROCUREMENT PLAN */}
            {activeTab === 'procurement' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-full flex flex-col">
                    <div className="p-6 border-b border-gray-200 bg-gray-50 flex justify-between items-center flex-shrink-0">
                         <div>
                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <ShoppingCart className="w-5 h-5 text-red-600" /> Procurement Plan
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Materials required to fulfill the entire campaign sequence.
                            </p>
                        </div>
                    </div>
                    <div className="overflow-auto flex-1">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-100 text-gray-600 uppercase text-xs sticky top-0 z-10">
                                <tr>
                                    <th className="px-6 py-3 bg-gray-100">Material</th>
                                    <th className="px-6 py-3 bg-gray-100">Supplier</th>
                                    <th className="px-6 py-3 text-center bg-gray-100">Lead Time</th>
                                    <th className="px-6 py-3 text-right bg-gray-100">Total Deficit</th>
                                    <th className="px-6 py-3 bg-gray-100">Critical Well Date</th>
                                    <th className="px-6 py-3 bg-gray-100">Order Deadline</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {procurementPlan.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                                            <div className="flex flex-col items-center justify-center">
                                                <CheckCircleIcon className="w-8 h-8 text-green-400 mb-2"/>
                                                No shortages detected for the current plan.
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    procurementPlan.map((item, idx) => {
                                        const isUrgent = new Date(item.orderDeadline) < new Date();
                                        return (
                                            <tr key={idx} className="hover:bg-red-50">
                                                <td className="px-6 py-3">
                                                    <div className="font-medium text-gray-900">{item.description}</div>
                                                    <div className="text-xs text-gray-500 font-mono">{item.sapCode}</div>
                                                </td>
                                                <td className="px-6 py-3 text-gray-600">{item.supplier}</td>
                                                <td className="px-6 py-3 text-center">{item.leadTime} Days</td>
                                                <td className="px-6 py-3 text-right font-bold text-red-600">-{item.totalDeficit}</td>
                                                <td className="px-6 py-3 text-gray-600">{item.firstRequiredDate}</td>
                                                <td className="px-6 py-3">
                                                    <div className={`flex items-center gap-2 ${isUrgent ? 'text-red-700 font-bold' : 'text-blue-700 font-medium'}`}>
                                                        <CalendarClock className="w-4 h-4" />
                                                        {item.orderDeadline}
                                                    </div>
                                                    {isUrgent && <span className="text-xs text-red-500 font-normal">Immediate Action Required</span>}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

        </main>
      </div>

      {/* Detail Modal */}
      {selectedResult && (
        <DetailModal 
            result={selectedResult} 
            onClose={() => setSelectedResult(null)} 
        />
      )}
    </div>
  );
};

// Helper icon
const CheckCircleIcon = ({className}:{className?:string}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
);

export default App;