import React, { useRef, useState } from 'react';
import { CheckCircle, AlertCircle, FileSpreadsheet } from 'lucide-react';
import { read, utils } from 'xlsx';

interface FileUploaderProps {
  label: string;
  onDataLoaded: (data: any[]) => void;
  required?: boolean;
  accept?: string;
  description?: string;
  columnsToDetect?: string[]; // New prop to identifying correct header row
}

const FileUploader: React.FC<FileUploaderProps> = ({ 
  label, 
  onDataLoaded, 
  required = false, 
  accept = ".xlsx, .xls, .csv",
  description,
  columnsToDetect = []
}) => {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [fileName, setFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    
    try {
      const data = await parseExcel(file);
      onDataLoaded(data);
      setStatus('success');
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  const parseExcel = (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];

          // If specific columns are required, we scan for the header row
          if (columnsToDetect.length > 0) {
            // Read as array of arrays first to find the header
            const aoa = utils.sheet_to_json(sheet, { header: 1 }) as any[][];
            
            let headerRowIndex = -1;
            
            // Scan first 20 rows for the header
            for (let i = 0; i < Math.min(aoa.length, 20); i++) {
              const row = aoa[i];
              // Check if this row contains ALL required columns (fuzzy match)
              const rowString = JSON.stringify(row).toLowerCase();
              const allFound = columnsToDetect.every(col => 
                rowString.includes(col.toLowerCase())
              );
              
              if (allFound) {
                headerRowIndex = i;
                break;
              }
            }

            if (headerRowIndex !== -1) {
              // Parse again starting from the found header row
              const jsonData = utils.sheet_to_json(sheet, { range: headerRowIndex });
              resolve(jsonData);
              return;
            }
            // If not found, fall through to default parsing (might be 0-indexed)
          }

          // Default parse
          const jsonData = utils.sheet_to_json(sheet);
          resolve(jsonData);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsBinaryString(file);
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between items-start mb-2">
        <div>
           <h3 className="font-medium text-gray-900 flex items-center gap-2">
            {label} 
            {required && <span className="text-red-500 text-xs font-bold">(Required)</span>}
          </h3>
          {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
        </div>
        <div className="ml-2">
          {status === 'success' && <CheckCircle className="w-5 h-5 text-green-500" />}
          {status === 'error' && <AlertCircle className="w-5 h-5 text-red-500" />}
        </div>
      </div>
      
      <div 
        onClick={() => fileInputRef.current?.click()}
        className={`mt-2 border-2 border-dashed rounded-md p-4 flex flex-col items-center justify-center cursor-pointer transition-colors
          ${status === 'error' ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:bg-gray-50'}`}
      >
        <FileSpreadsheet className="w-8 h-8 text-gray-400 mb-2" />
        <span className="text-sm text-gray-600 text-center">
            {fileName ? fileName : 'Click to upload Excel'}
        </span>
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept={accept} 
        className="hidden" 
      />
    </div>
  );
};

export default FileUploader;