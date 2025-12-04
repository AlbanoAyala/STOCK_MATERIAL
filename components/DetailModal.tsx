
import React, { useState } from 'react';
import { SimulationResult } from '../types';
import { X, AlertTriangle, CheckCircle, BarChart3, ClipboardList, Activity } from 'lucide-react';

interface DetailModalProps {
  result: SimulationResult | null;
  onClose: () => void;
}

const DetailModal: React.FC<DetailModalProps> = ({ result, onClose }) => {
  const [activeTab, setActiveTab] = useState<'analysis' | 'bom'>('analysis');

  if (!result) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-xl">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{result.wellName}</h2>
            <p className="text-sm text-gray-500">Type: {result.wellType}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-gray-200 px-6">
            <button
                onClick={() => setActiveTab('analysis')}
                className={`flex items-center gap-2 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'analysis' 
                        ? 'border-blue-500 text-blue-600' 
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
                <Activity className="w-4 h-4" />
                Feasibility Analysis
            </button>
            <button
                onClick={() => setActiveTab('bom')}
                className={`flex items-center gap-2 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'bom' 
                        ? 'border-blue-500 text-blue-600' 
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
                <ClipboardList className="w-4 h-4" />
                Assigned Materials
            </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          
          {/* TAB: FEASIBILITY ANALYSIS */}
          {activeTab === 'analysis' && (
              <>
                <div className="mb-6 flex gap-4">
                    <div className={`flex-1 p-4 rounded-lg border ${result.isFeasible ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                        <span className="text-sm font-medium uppercase text-gray-500">Overall Status</span>
                        <div className="flex items-center gap-2 mt-1">
                            {result.isFeasible ? <CheckCircle className="text-green-600"/> : <AlertTriangle className="text-red-600"/>}
                            <span className={`text-2xl font-bold ${result.isFeasible ? 'text-green-700' : 'text-red-700'}`}>
                                {result.isFeasible ? 'FEASIBLE' : 'SHORTAGE DETECTED'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Bar Chart Visualization Section */}
                {result.missingItems.length > 0 && (
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-gray-500"/>
                            Stock Availability Analysis
                        </h3>
                        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                            <p className="text-sm text-gray-500 mb-4">
                                Comparison of required quantity vs. currently available stock for critical missing items.
                            </p>
                            <div className="space-y-6">
                                {result.missingItems.map((item, idx) => {
                                    // Calculate percentage width for the available bar
                                    const availablePct = Math.min((item.available / item.required) * 100, 100);
                                    const deficitPct = 100 - availablePct;
                                    
                                    return (
                                        <div key={idx} className="flex flex-col gap-2">
                                            <div className="flex justify-between items-end text-sm">
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-gray-800 truncate pr-4" title={item.materialDescripcion}>
                                                        {item.materialDescripcion}
                                                    </span>
                                                    <span className="text-xs text-gray-400">Target Required: {item.required}</span>
                                                </div>
                                                
                                                <div className="flex items-center gap-4 text-xs font-medium">
                                                    <span className="flex items-center gap-1.5 text-blue-700">
                                                        <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                                                        Has: {item.available}
                                                    </span>
                                                    <span className="flex items-center gap-1.5 text-red-700">
                                                        <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                                                        Missing: {item.deficit}
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            {/* Stacked Bar */}
                                            <div className="h-5 w-full bg-red-100 rounded-md overflow-hidden border border-red-200 relative flex">
                                                {/* Available Segment */}
                                                <div 
                                                    className="h-full bg-blue-500 flex items-center justify-center text-[10px] text-white font-bold transition-all duration-500 shadow-sm"
                                                    style={{ width: `${availablePct}%` }}
                                                >
                                                    {availablePct > 15 && `${Math.round(availablePct)}%`}
                                                </div>
                                                
                                                {/* Deficit Segment */}
                                                <div 
                                                    className="h-full bg-red-100 flex items-center justify-center text-[10px] text-red-800 font-bold transition-all duration-500"
                                                    style={{ width: `${deficitPct}%` }}
                                                >
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                <h3 className="text-lg font-semibold text-gray-800 mb-4">Shortage Report</h3>
                
                {result.missingItems.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                        <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-2" />
                        <p className="text-gray-600 font-medium">No material shortages for this well.</p>
                        <p className="text-gray-400 text-sm">Stock is sufficient for all stages.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left border rounded-lg overflow-hidden">
                        <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                        <tr>
                            <th className="px-4 py-3">Stage</th>
                            <th className="px-4 py-3">Material Description</th>
                            <th className="px-4 py-3 text-right">Required</th>
                            <th className="px-4 py-3 text-right">Available</th>
                            <th className="px-4 py-3 text-right">Deficit</th>
                            <th className="px-4 py-3">Affected SAP Codes</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                        {result.missingItems.map((item, idx) => (
                            <tr key={idx} className="bg-red-50/50 hover:bg-red-50">
                            <td className="px-4 py-3 font-medium text-gray-800">{item.etapa}</td>
                            <td className="px-4 py-3 text-gray-700">{item.materialDescripcion}</td>
                            <td className="px-4 py-3 text-right font-mono">{item.required}</td>
                            <td className="px-4 py-3 text-right font-mono text-gray-600">{item.available}</td>
                            <td className="px-4 py-3 text-right font-bold text-red-600 font-mono">-{item.deficit}</td>
                            <td className="px-4 py-3 text-xs text-gray-500 max-w-xs break-words">
                                {item.sapCodes.join(", ")}
                            </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    </div>
                )}
              </>
          )}

          {/* TAB: ASSIGNED MATERIALS (BOM) */}
          {activeTab === 'bom' && (
              <div>
                  <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">Bill of Materials</h3>
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                             <span className="w-2 h-2 rounded-full bg-green-500"></span> Used
                        </span>
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                             <span className="w-2 h-2 rounded-full bg-gray-300"></span> Alternative
                        </span>
                        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full ml-2">
                          {result.assignedItems.length} items configured
                        </span>
                      </div>
                  </div>
                  
                  <div className="overflow-x-auto rounded-lg border border-gray-200">
                      <table className="w-full text-sm text-left">
                          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                              <tr>
                                  <th className="px-4 py-3 w-32">Stage</th>
                                  <th className="px-4 py-3">Description</th>
                                  <th className="px-4 py-3 text-center w-24">Quantity</th>
                                  <th className="px-4 py-3 w-1/3">Assigned SAP Codes</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                              {result.assignedItems.map((item, idx) => {
                                  const isMissing = item.status === 'MISSING';
                                  
                                  return (
                                    <tr 
                                        key={idx} 
                                        className={isMissing ? 'bg-red-50' : 'hover:bg-gray-50'}
                                    >
                                        <td className="px-4 py-3 font-medium text-gray-700">
                                            <span className={`inline-block rounded px-2 py-0.5 text-xs ${isMissing ? 'bg-red-100 text-red-700' : 'bg-gray-200'}`}>
                                                {item.etapa}
                                            </span>
                                        </td>
                                        <td className={`px-4 py-3 font-medium ${isMissing ? 'text-red-800' : 'text-gray-900'}`}>
                                            {item.descripcion}
                                        </td>
                                        <td className="px-4 py-3 text-center font-mono text-gray-600">
                                            {item.cantidad}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex flex-wrap gap-1">
                                                {item.sapCodes.map(code => {
                                                    const isUsed = item.usedSapCodes.includes(code);
                                                    
                                                    return (
                                                        <span 
                                                            key={code} 
                                                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-medium border
                                                                ${isUsed 
                                                                    ? 'bg-green-100 text-green-700 border-green-200' 
                                                                    : 'bg-white text-gray-400 border-gray-200'
                                                                }
                                                            `}
                                                        >
                                                            {code}
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                        </td>
                                    </tr>
                                  );
                              })}
                          </tbody>
                      </table>
                  </div>
              </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end rounded-b-xl">
           <button 
             onClick={onClose}
             className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium"
           >
             Close
           </button>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;
