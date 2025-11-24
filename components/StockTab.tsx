import React, { useMemo, useState } from 'react';
import { StockItem } from '../types';
import { Search, Filter } from 'lucide-react';

interface StockTabProps {
  stock: StockItem[];
}

const StockTab: React.FC<StockTabProps> = ({ stock }) => {
  const [search, setSearch] = useState('');
  const [filterGroup, setFilterGroup] = useState<'ALL' | 'GSJ' | 'CA'>('ALL');

  const filteredStock = useMemo(() => {
    return stock.filter(item => {
      const matchesSearch = 
        item.code.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase()) ||
        item.supplier?.toLowerCase().includes(search.toLowerCase());
      
      const matchesGroup = filterGroup === 'ALL' || item.warehouseGroup === filterGroup;

      return matchesSearch && matchesGroup;
    });
  }, [stock, search, filterGroup]);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="relative w-full sm:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar por código, descripción o proveedor..."
            className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg leading-5 bg-white placeholder-slate-500 focus:outline-none focus:placeholder-slate-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-slate-500" />
          <div className="flex bg-slate-100 rounded-lg p-1">
            {['ALL', 'GSJ', 'CA'].map((g) => (
              <button
                key={g}
                onClick={() => setFilterGroup(g as any)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                  filterGroup === g 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {g === 'ALL' ? 'Todos' : g}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Código</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Descripción</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Almacén (Grp)</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Proveedor</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Cantidad</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredStock.length > 0 ? (
                filteredStock.map((item, idx) => (
                  <tr key={`${item.code}-${idx}`} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{item.code}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{item.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.warehouseGroup === 'GSJ' ? 'bg-purple-100 text-purple-800' :
                        item.warehouseGroup === 'CA' ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {item.warehouseGroup}
                      </span>
                      <span className="ml-2 text-xs text-slate-400">({item.originalWarehouse})</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{item.supplier}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-slate-700">
                      {item.quantity.toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    No se encontraron materiales con los filtros actuales.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StockTab;