import React, { useState, useEffect } from 'react';
import type { UploadedFile } from '../types/types';
import { CloseIcon, PdfFileIcon } from './icons';

interface SelectionDialogProps {
  isOpen: boolean;
  files: UploadedFile[];
  onClose: () => void;
  onGenerate: (text: string) => void;
}

const SelectionDialog: React.FC<SelectionDialogProps> = ({ isOpen, files, onClose, onGenerate }) => {
  const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setSelectedFile(null);
    } else if (files.length > 0) {
        // Pre-select the first file when the dialog opens
        setSelectedFile(files[0]);
    }
  }, [isOpen, files]);

  if (!isOpen) return null;

  const handleGenerateClick = () => {
    if (selectedFile) {
      onGenerate(selectedFile.text);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4" role="dialog" aria-modal="true">
      <div className="bg-slate-800 rounded-2xl shadow-xl w-full max-w-lg border border-slate-700 animate-fade-in-up">
        <div className="p-6 border-b border-slate-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Select a Document</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors" aria-label="Close dialog">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <p className="text-slate-400 mb-4">Choose which document you'd like to generate study aids for.</p>
          <div className="space-y-3">
            {files.map((file) => (
              <label
                key={file.name}
                className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedFile?.name === file.name
                    ? 'border-sky-500 bg-sky-900/50'
                    : 'border-slate-600 bg-slate-700 hover:bg-slate-600/70'
                }`}
              >
                <input
                  type="radio"
                  name="file-selection"
                  className="hidden"
                  onChange={() => setSelectedFile(file)}
                  checked={selectedFile?.name === file.name}
                />
                <PdfFileIcon className="w-6 h-6 text-red-400 mr-4 flex-shrink-0" />
                <span className="text-slate-200 font-medium truncate">{file.name}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="p-6 border-t border-slate-700 flex justify-end gap-3">
           <button
            onClick={onClose}
            className="bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleGenerateClick}
            disabled={!selectedFile}
            className="flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-6 rounded-lg transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Generate
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectionDialog;
