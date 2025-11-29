import React, { useState, useRef } from 'react';
import type { UploadedFile } from '../types/types';
import { SparklesIcon, FileUploadIcon, PdfFileIcon, TrashIcon } from './icons';
import { FileType } from 'lucide-react';

interface InputViewProps {
  onFilesUpload: (files: FileList) => void;
  onFileDelete: (fileName: string) => void;
  onRequestGenerate: (generationTypes: ('summaries' | 'flashcards' | 'quiz')[]) => void;
  uploadedFiles: UploadedFile[];
  isParsing: boolean;
  isGenerating: { summaries: boolean; flashcards: boolean; quiz: boolean; };
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
  const [selectedGenerationTypes, setSelectedGenerationTypes] = useState<('summaries' | 'flashcards' | 'quiz')[]>([]);

  const handleGenerationTypeChange = (type: 'summaries' | 'flashcards' | 'quiz') => {
    setSelectedGenerationTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleGenerateClick = () => {
    if (selectedGenerationTypes.length > 0) {
      onRequestGenerate(selectedGenerationTypes);
    }
  };

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
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const isLoading = isParsing || Object.values(isGenerating).some(Boolean);
  const hasFiles = uploadedFiles.length > 0;

  return (
    <div className="w-full max-w-4xl mx-auto p-6 flex flex-col items-center relative">
      {/* Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-black/5 rounded-full blur-xl animate-float-slow"></div>
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-black/3 rounded-full blur-xl animate-float-medium"></div>
        <div className="absolute top-1/3 left-1/4 w-40 h-40 bg-black/8 rounded-full blur-lg animate-float-fast"></div>
      </div>

      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-black/5 rounded-2xl flex items-center justify-center">
            <FileType className="w-10 h-10 text-gray-700" />
          </div>
        </div>
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Study Smarter!
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl leading-relaxed">
          Upload your PDF documents and instantly generate summaries, flashcards, and quizzes to enhance your learning experience.
        </p>
      </div>

      <div className="w-full max-w-2xl">
        {/* Upload Area */}
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={openFilePicker}
          className={`relative w-full h-48 flex flex-col justify-center items-center p-8 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 bg-white ${
            isDragging 
              ? 'border-black bg-gray-50 shadow-lg' 
              : 'border-gray-300 hover:border-gray-400 hover:shadow-md'
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
          
          <div className={`p-4 rounded-2xl mb-4 transition-colors ${
            isDragging ? 'bg-black/5' : 'bg-gray-100'
          }`}>
            <FileUploadIcon className="w-8 h-8 text-gray-600" />
          </div>
          
          <p className="text-gray-700 font-semibold text-lg mb-2">
            Drag & drop PDF files here
          </p>
          <p className="text-gray-500">
            or <span className="text-black font-medium underline">browse your files</span>
          </p>
          <p className="text-sm text-gray-400 mt-2">Multiple PDFs supported</p>
        </div>

        {/* Loading State */}
        {isParsing && (
          <div className="flex items-center justify-center gap-3 mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-blue-700 font-medium">Processing PDF documents...</span>
          </div>
        )}

        {/* Uploaded Files List */}
        {hasFiles && (
          <div className="w-full mt-8 bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <h3 className="text-lg font-semibold text-gray-900">
                Uploaded Documents ({uploadedFiles.length})
              </h3>
            </div>
            
            <div className="space-y-3">
              {uploadedFiles.map((file) => (
                <div key={file.name} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200 border border-gray-200">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="p-2 bg-red-50 rounded-lg">
                      <PdfFileIcon className="w-5 h-5 text-red-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-900 font-medium truncate">{file.name}</p>
                      <p className="text-gray-500 text-sm">
                        {file.text.length > 100 ? `${file.text.substring(0, 100)}...` : file.text}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => onFileDelete(file.name)} 
                    disabled={isLoading}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label={`Remove ${file.name}`}
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Generate Buttons */}
        <div className="w-full mt-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose what to generate:</h3>
          <div className="flex flex-col space-y-3">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedGenerationTypes.includes('summaries')}
                onChange={() => handleGenerationTypeChange('summaries')}
                disabled={isLoading}
                className="form-checkbox h-5 w-5 text-purple-600 rounded focus:ring-purple-500"
              />
              <span className="text-gray-800 font-medium">Summaries</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedGenerationTypes.includes('flashcards')}
                onChange={() => handleGenerationTypeChange('flashcards')}
                disabled={isLoading}
                className="form-checkbox h-5 w-5 text-green-600 rounded focus:ring-green-500"
              />
              <span className="text-gray-800 font-medium">Flashcards</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedGenerationTypes.includes('quiz')}
                onChange={() => handleGenerationTypeChange('quiz')}
                disabled={isLoading}
                className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-gray-800 font-medium">Quizzes</span>
            </label>
          </div>

          <button
            onClick={handleGenerateClick}
            disabled={isLoading || !hasFiles || selectedGenerationTypes.length === 0}
            className={`mt-6 w-full flex items-center justify-center gap-4 py-4 px-8 rounded-2xl font-semibold text-lg transition-all duration-300 ${
              !isLoading && hasFiles && selectedGenerationTypes.length > 0
                ? 'bg-black hover:bg-gray-800 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            {(isGenerating.summaries || isGenerating.flashcards || isGenerating.quiz) ? (
              <>
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Generating Study Materials...</span>
              </>
            ) : (
              <>
                <SparklesIcon className="w-6 h-6" />
                <span>Generate Selected Materials</span>
              </>
            )}
          </button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="text-center p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FileType className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Smart Summaries</h4>
            <p className="text-gray-600 text-sm">Get concise, detailed, and comprehensive summaries</p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <SparklesIcon className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Interactive Flashcards</h4>
            <p className="text-gray-600 text-sm">Flip through key concepts and definitions</p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FileType className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Practice Quizzes</h4>
            <p className="text-gray-600 text-sm">Test your knowledge with MCQs and short answers</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputView;