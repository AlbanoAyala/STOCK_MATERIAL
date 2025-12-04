import React from 'react';
import { WellPlan, WellTypeRequirement } from '../types';
import { Trash2, ArrowUp, ArrowDown, Plus, Calendar } from 'lucide-react';

interface WellPlannerProps {
  plan: WellPlan[];
  wellTypes: WellTypeRequirement[];
  onPlanChange: (newPlan: WellPlan[]) => void;
}

const WellPlanner: React.FC<WellPlannerProps> = ({ plan, wellTypes, onPlanChange }) => {

  const handleMove = (index: number, direction: -1 | 1) => {
    const newPlan = [...plan];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newPlan.length) return;
    
    [newPlan[index], newPlan[targetIndex]] = [newPlan[targetIndex], newPlan[index]];
    onPlanChange(newPlan);
  };

  const handleDelete = (index: number) => {
    const newPlan = plan.filter((_, i) => i !== index);
    onPlanChange(newPlan);
  };

  const handleTypeChange = (index: number, newType: string) => {
    const newPlan = [...plan];
    newPlan[index].type = newType;
    onPlanChange(newPlan);
  };

  const handleNameChange = (index: number, newName: string) => {
    const newPlan = [...plan];
    newPlan[index].name = newName;
    onPlanChange(newPlan);
  };

  const handleDateChange = (index: number, newDate: string) => {
    const newPlan = [...plan];
    newPlan[index].startDate = newDate;
    onPlanChange(newPlan);
  };

  const handleAddWell = () => {
    const today = new Date();
    // Default to today + index * 15 days for a staggered schedule
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + (plan.length * 15));
    
    const newWell: WellPlan = {
      id: Math.random().toString(36).substr(2, 9),
      name: `New Well ${plan.length + 1}`,
      type: wellTypes[0]?.tipo_pozo || 'Convencional',
      startDate: nextDate.toISOString().split('T')[0]
    };
    onPlanChange([...plan, newWell]);
  };

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
        <h2 className="font-semibold text-lg text-gray-800">Well Sequence Plan</h2>
        <button 
          onClick={handleAddWell}
          className="flex items-center gap-1 text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Well
        </button>
      </div>
      
      <div className="overflow-y-auto flex-1 p-2">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50 sticky top-0">
            <tr>
              <th className="px-3 py-2">Order</th>
              <th className="px-3 py-2">Well Name</th>
              <th className="px-3 py-2">Start Date</th>
              <th className="px-3 py-2">Type</th>
              <th className="px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {plan.map((well, index) => (
              <tr key={well.id} className="border-b last:border-0 hover:bg-gray-50 group">
                <td className="px-3 py-2 w-16">
                  <div className="flex gap-1">
                    <button 
                      onClick={() => handleMove(index, -1)} 
                      disabled={index === 0}
                      className="p-1 text-gray-500 hover:text-blue-600 disabled:opacity-30"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleMove(index, 1)} 
                      disabled={index === plan.length - 1}
                      className="p-1 text-gray-500 hover:text-blue-600 disabled:opacity-30"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  </div>
                </td>
                <td className="px-3 py-2">
                  <input 
                    type="text" 
                    value={well.name}
                    onChange={(e) => handleNameChange(index, e.target.value)}
                    className="w-full border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 px-2 py-1"
                  />
                </td>
                <td className="px-3 py-2 w-36">
                  <div className="relative">
                    <input 
                        type="date" 
                        value={well.startDate}
                        onChange={(e) => handleDateChange(index, e.target.value)}
                        className="w-full border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 px-2 py-1 pl-8 text-xs"
                    />
                    <Calendar className="w-3 h-3 text-gray-400 absolute left-2.5 top-2 pointer-events-none" />
                  </div>
                </td>
                <td className="px-3 py-2">
                  <select 
                    value={well.type}
                    onChange={(e) => handleTypeChange(index, e.target.value)}
                    className="w-full border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 px-2 py-1"
                  >
                    {wellTypes.map(t => (
                      <option key={t.tipo_pozo} value={t.tipo_pozo}>{t.tipo_pozo}</option>
                    ))}
                  </select>
                </td>
                <td className="px-3 py-2 text-right">
                  <button 
                    onClick={() => handleDelete(index)}
                    className="p-1 text-red-400 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {plan.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-400">
                  No wells added. Add a well or upload a plan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WellPlanner;