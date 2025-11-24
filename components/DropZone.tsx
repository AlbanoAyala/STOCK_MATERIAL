import React, { useRef, useState } from 'react';
import { Upload, FileSpreadsheet, CheckCircle } from 'lucide-react';

interface DropZoneProps {
  label: string;
  onFileLoaded: (file: File) => void;
  isLoaded: boolean;
  fileName?: string;
}

const DropZone: React.FC<DropZoneProps> = ({ label, onFileLoaded, isLoaded, fileName }) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileLoaded(e.dataTransfer.files[0]);
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileLoaded(e.target.files[0]);
    }
  };

  return (
    <div
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        relative overflow-hidden cursor-pointer group
        border-2 border-dashed rounded-xl p-6 transition-all duration-300
        flex flex-col items-center justify-center text-center h-40
        ${isLoaded 
          ? 'border-emerald-500 bg-emerald-50' 
          : isDragging 
            ? 'border-blue-500 bg-blue-50 scale-[1.02]' 
            : 'border-slate-300 bg-white hover:border-blue-400 hover:bg-slate-50'
        }
      `}
    >
      <input 
        type="file" 
        ref={inputRef} 
        onChange={handleChange} 
        className="hidden" 
        accept=".xlsx,.xls,.csv"
      />
      
      {isLoaded ? (
        <>
          <CheckCircle className="w-10 h-10 text-emerald-500 mb-2" />
          <p className="text-sm font-semibold text-emerald-700">{label}</p>
          <p className="text-xs text-emerald-600 truncate max-w-full px-4">{fileName}</p>
        </>
      ) : (
        <>
          <div className="bg-slate-100 p-3 rounded-full mb-3 group-hover:bg-blue-100 transition-colors">
            {isDragging ? (
              <Upload className="w-6 h-6 text-blue-600" />
            ) : (
              <FileSpreadsheet className="w-6 h-6 text-slate-500 group-hover:text-blue-600" />
            )}
          </div>
          <p className="text-sm font-medium text-slate-700 group-hover:text-blue-700">{label}</p>
          <p className="text-xs text-slate-400 mt-1">Arrastra o haz click</p>
        </>
      )}
    </div>
  );
};

export default DropZone;