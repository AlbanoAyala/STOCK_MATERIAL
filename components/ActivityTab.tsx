
import React, { useMemo, useState } from 'react';
import { GlobalAnalysis, WellAnalysis } from '../types';
import { AlertTriangle, CheckCircle, Droplets, Hammer, Info } from 'lucide-react';

interface ActivityTabProps {
  analysis: GlobalAnalysis;
}

const ActivityTab: React.FC<ActivityTabProps> = ({ analysis }) => {
  const [selectedWell, setSelectedWell] = useState<WellAnalysis | null>(null);

  // If no well is selected explicitly, maybe show the first one that has issues, or just none.
  // Let's show the first one with issues by default if available.
  const activeWell = selectedWell || analysis.wells.find(w => !w.canDrillFull) || analysis.wells[0];

  return (
    <div className="space-y-8 animate-fadeIn pb-10">
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="p-4 rounded-full bg-emerald-100 text-emerald-600">
            <CheckCircle className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Pozos Completos</p>
            <p className="text-3xl font-bold text-slate-800">{analysis.totalFullWellsPossible}</p>
            <p className="text-xs text-slate-400">Con stock actual</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="p-4 rounded-full bg-blue-100 text-blue-600">
            <Hammer className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Secciones Guía</p>
            <p className="text-3xl font-bold text-slate-800">{analysis.totalGuiaPossible} <span className="text-sm font-normal text-slate-400">/ {analysis.wells.length}</span></p>
            <p className="text-xs text-slate-400">Posibles de ejecutar</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="p-4 rounded-full bg-amber-100 text-amber-600">
            <Droplets className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Secciones Aislación</p>
            <p className="text-3xl font-bold text-slate-800">{analysis.totalAislacionPossible} <span className="text-sm font-normal text-slate-400">/ {analysis.wells.length}</span></p>
            <p className="text-xs text-slate-400">Posibles de ejecutar</p>
          </div>
        </div>
      </div>

      {/* Main Comparative Scroll View */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 overflow-hidden">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Secuencia de Perforación (Ordenada por Fecha)</h3>
        <div className="overflow-x-auto pb-4 scrollbar-thin">
          <div className="flex gap-4 min-w-max">
            {analysis.wells.map((well, idx) => (
              <div 
                key={idx}
                onClick={() => setSelectedWell(well)}
                className={`
                  relative flex flex-col w-48 rounded-xl border-2 transition-all cursor-pointer overflow-hidden
                  ${activeWell?.wellName === well.wellName 
                    ? 'border-blue-500 shadow-md scale-105 z-10' 
                    : 'border-slate-200 hover:border-blue-300 bg-slate-50'
                  }
                `}
              >
                {/* Header */}
                <div className="bg-slate-800 text-white p-3 text-center">
                  <p className="font-bold truncate">{well.wellName}</p>
                  <p className="text-xs opacity-75">{well.date}</p>
                </div>

                {/* Body */}
                <div className="p-4 space-y-4 bg-white flex-1 flex flex-col justify-center">
                  {/* Semaphores */}
                  <div className="flex justify-between items-center px-2">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-xs font-semibold text-slate-500">Guía</span>
                      <div className={`w-6 h-6 rounded-full shadow-inner ${well.sectionGuiaStatus === 'OK' ? 'bg-emerald-500' : 'bg-red-500 animate-pulse'}`} />
                    </div>
                    <div className="w-px h-8 bg-slate-200"></div>
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-xs font-semibold text-slate-500">Aislación</span>
                      <div className={`w-6 h-6 rounded-full shadow-inner ${well.sectionAislacionStatus === 'OK' ? 'bg-emerald-500' : 'bg-red-500 animate-pulse'}`} />
                    </div>
                  </div>
                  
                  {/* Info */}
                  <div className="text-center pt-2 border-t border-slate-100">
                     <span className="inline-block px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md font-medium">
                       {well.wellGroup}
                     </span>
                  </div>
                </div>

                {/* Missing Badge */}
                {!well.canDrillFull && (
                   <div className="bg-red-50 p-2 text-center border-t border-red-100">
                     <p className="text-xs text-red-600 font-bold flex items-center justify-center gap-1">
                       <AlertTriangle className="w-3 h-3" />
                       Falta Material
                     </p>
                   </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Well Details - Full Width */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Info className="w-5 h-5 text-blue-500" />
            Detalle del Pozo: <span className="text-blue-600">{activeWell?.wellName}</span>
          </h3>
          {activeWell?.canDrillFull ? (
            <span className="bg-emerald-100 text-emerald-800 text-xs px-3 py-1 rounded-full font-bold">VIABLE</span>
          ) : (
            <span className="bg-red-100 text-red-800 text-xs px-3 py-1 rounded-full font-bold">CRÍTICO</span>
          )}
        </div>
        
        <div className="p-0">
            {!activeWell ? (
              <div className="p-8 text-center text-slate-400">Seleccione un pozo para ver detalles.</div>
            ) : activeWell.missingMaterials.length === 0 ? (
              <div className="p-12 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-emerald-600" />
                </div>
                <h4 className="text-emerald-800 font-bold text-lg">Stock Suficiente</h4>
                <p className="text-slate-500 max-w-xs mt-2">Todos los materiales para las secciones Guía y Aislación están disponibles para este pozo.</p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Sección</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Código</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Descripción</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Faltante</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {activeWell.missingMaterials.map((miss, idx) => (
                    <tr key={idx} className="bg-red-50/50">
                      <td className="px-6 py-4 text-sm font-bold text-slate-700">{miss.section}</td>
                      <td className="px-6 py-4 text-sm text-slate-600 font-mono">{miss.code}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{miss.description}</td>
                      <td className="px-6 py-4 text-sm text-right text-red-600 font-bold">{miss.missing.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
        </div>
      </div>

      {/* Global Missing List - Full Width at Bottom */}
      <div className="bg-white rounded-xl shadow-md border-l-4 border-l-amber-500 overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-slate-200 bg-amber-50/50">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-amber-500" />
            Consolidado Total de Faltantes (Campaña Completa)
          </h3>
          <p className="text-sm text-slate-500 mt-1">Materiales que faltan para completar todos los pozos planificados en la lista.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Código (Pref.)</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Descripción</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Proveedor</th>
                <th className="px-6 py-3 text-right text-xs font-bold text-slate-600 uppercase tracking-wider">Cantidad Total Faltante</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {analysis.consolidatedMissing.length === 0 ? (
                <tr>
                    <td colSpan={4} className="p-12 text-center text-slate-500 flex flex-col items-center">
                      <CheckCircle className="w-12 h-12 text-emerald-400 mb-2" />
                      <span className="font-medium text-lg">¡Excelente!</span>
                      <span>No hay faltantes globales para la campaña planificada.</span>
                    </td>
                </tr>
              ) : (
                analysis.consolidatedMissing.map((item, idx) => (
                  <tr key={idx} className="hover:bg-amber-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono font-medium text-slate-700 bg-slate-50/50">{item.code}</td>
                    <td className="px-6 py-4 text-sm text-slate-700 font-medium">{item.description}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{item.supplier}</td>
                    <td className="px-6 py-4 text-sm text-right font-bold text-red-600 bg-red-50/30">{item.totalMissing.toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default ActivityTab;
