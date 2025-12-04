import React from 'react';

interface TrafficLightProps {
  status: 'OK' | 'CRITICAL';
  label?: string;
}

const TrafficLight: React.FC<TrafficLightProps> = ({ status, label }) => {
  const isOk = status === 'OK';
  
  return (
    <div className="flex flex-col items-center justify-center">
      <div 
        className={`w-8 h-8 rounded-full border-2 shadow-sm transition-all duration-300 ${
          isOk 
            ? 'bg-green-500 border-green-600 shadow-green-200' 
            : 'bg-red-500 border-red-600 shadow-red-200 animate-pulse'
        }`}
      />
      {label && <span className="text-xs font-semibold text-gray-500 mt-1">{label}</span>}
    </div>
  );
};

export default TrafficLight;
