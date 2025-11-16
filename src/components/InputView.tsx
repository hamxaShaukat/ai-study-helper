import React, { useState, useRef } from 'react';
import type { UploadedFile } from '../types/types';
import { SparklesIcon, FileUploadIcon, PdfFileIcon, TrashIcon } from './icons';

interface InputViewProps {
  onFilesUpload: (files: FileList) => void;
  onFileDelete: (fileName: string) => void;
  onRequestGenerate: () => void;
  uploadedFiles: UploadedFile[];
  isParsing: boolean;
  isGenerating: boolean;
}

const InputView: React.FC<InputViewProps> = ({ 
  onFilesUpload, 
  onFileDelete,
  onRequestGenerate,
  uploadedFiles, 
  isParsing,
  isGenerating
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      onFilesUpload(files);
    }
  };
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFilesUpload(files);
    }
    // Reset input to allow re-uploading the same file
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const isLoading = isParsing || isGenerating;
  const hasFiles = uploadedFiles.length > 0;

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8 flex flex-col items-center">
      <div className="text-center">
         <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-indigo-500">
            AI Study Helper
        </h1>
        <p className="mt-4 text-lg text-slate-400">
            Upload your study material in PDF format, and let AI create summaries, flashcards, and quizzes for you.
        </p>
      </div>

      <div className="w-full mt-10">
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={openFilePicker}
          className={`relative w-full h-48 flex flex-col justify-center items-center p-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 ${
            isDragging ? 'border-sky-400 bg-sky-900/30' : 'border-slate-600 hover:border-sky-500 hover:bg-slate-800/50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf"
            className="hidden"
            onChange={handleFileSelect}
            disabled={isLoading}
          />
          <FileUploadIcon className="w-12 h-12 text-slate-500 mb-2" />
          <p className="text-slate-400 font-semibold">
            Drag & drop PDF files here, or <span className="text-sky-400">browse</span>
          </p>
          <p className="text-sm text-slate-500">Supports multiple PDFs</p>
        </div>

        {isParsing && (
            <div className="text-center mt-4 text-sky-300 flex items-center justify-center gap-2">
                 <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Parsing PDF(s)...
            </div>
        )}

        {hasFiles && (
          <div className="w-full mt-6 bg-slate-800/50 border border-slate-700 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-slate-300 mb-3 px-2">Uploaded Documents</h3>
            <ul className="space-y-2">
              {uploadedFiles.map((file) => (
                <li key={file.name} className="flex items-center justify-between p-2 rounded-md bg-slate-700/50 hover:bg-slate-700 transition-colors">
                  <div className="flex items-center gap-3 truncate">
                    <PdfFileIcon className="w-5 h-5 text-red-400 flex-shrink-0" />
                    <span className="text-slate-200 truncate">{file.name}</span>
                  </div>
                  <button 
                    onClick={() => onFileDelete(file.name)} 
                    disabled={isLoading}
                    className="p-1 rounded-full text-slate-400 hover:bg-slate-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label={`Remove ${file.name}`}
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          onClick={onRequestGenerate}
          disabled={isLoading || !hasFiles}
          className="mt-6 w-full flex items-center justify-center gap-3 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 disabled:hover:scale-100"
        >
          {isGenerating ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
             <>
                <SparklesIcon className="w-5 h-5" />
                Generate Study Aids
             </>
          )}
        </button>
      </div>
    </div>
  );
};

export default InputView;
