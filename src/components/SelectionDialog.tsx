import React, { useState, useEffect } from 'react';
import type { UploadedFile } from '../types/types';
import { CloseIcon, PdfFileIcon } from './icons';
import { FileSearch } from 'lucide-react';

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
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-fade-in" role="dialog" aria-modal="true">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-200 animate-scale-in">
        {/* Header */}
        <div className="p-8 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-black/5 rounded-xl">
              <FileSearch className="w-6 h-6 text-gray-700" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Select Document
              </h2>
              <p className="text-gray-600 text-sm mt-1">Choose which PDF to generate study materials from</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-200 group"
            aria-label="Close dialog"
          >
            <CloseIcon className="w-6 h-6 text-gray-500 group-hover:text-gray-700 transition-colors" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 max-h-[60vh] overflow-y-auto">
          <div className="grid gap-3">
            {files.map((file, index) => (
              <div
                key={file.name}
                className={`relative p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 group ${
                  selectedFile?.name === file.name
                    ? 'border-black bg-black/5 shadow-md'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => setSelectedFile(file)}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg transition-all duration-200 ${
                    selectedFile?.name === file.name 
                      ? 'bg-black/10' 
                      : 'bg-gray-100 group-hover:bg-gray-200'
                  }`}>
                    <PdfFileIcon className={`w-5 h-5 ${
                      selectedFile?.name === file.name ? 'text-gray-900' : 'text-gray-600'
                    }`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-gray-900 font-semibold truncate">
                      {file.name}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                      {file.text.length > 120 
                        ? `${file.text.substring(0, 120)}...` 
                        : file.text
                      }
                    </p>
                  </div>

                  <div className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                    selectedFile?.name === file.name
                      ? 'bg-black border-black'
                      : 'border-gray-400 group-hover:border-gray-600'
                  }`}>
                    {selectedFile?.name === file.name && (
                      <div className="w-full h-full rounded-full bg-white scale-50"></div>
                    )}
                  </div>
                </div>

                {/* Selection indicator */}
                {selectedFile?.name === file.name && (
                  <div className="absolute top-3 right-3">
                    <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-lg bg-white hover:bg-gray-100 text-gray-700 font-medium transition-all duration-200 border border-gray-300 hover:border-gray-400 shadow-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleGenerateClick}
              disabled={!selectedFile}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-black hover:bg-gray-800 text-white font-medium transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-sm group"
            >
              
              <FileSearch className="w-4 h-4 group-hover:scale-110 transition-transform" />
              Generate Materials
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectionDialog;