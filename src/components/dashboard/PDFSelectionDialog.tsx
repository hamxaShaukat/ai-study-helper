import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, FileCheck, Loader } from "lucide-react";
import type { UploadedFile } from "../../types/types";

interface PDFSelectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  uploadedFiles: UploadedFile[];
  onGenerate: (selectedFiles: UploadedFile[]) => Promise<void>;
  title: string;
}

export function PDFSelectionDialog({
  isOpen,
  onClose,
  uploadedFiles,
  onGenerate,
  title,
}: PDFSelectionDialogProps) {
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const toggleFile = (fileName: string) => {
    if (selectedFiles.includes(fileName)) {
      setSelectedFiles(selectedFiles.filter((f) => f !== fileName));
    } else {
      setSelectedFiles([...selectedFiles, fileName]);
    }
  };

  const handleGenerate = async () => {
    const filesToGenerate = uploadedFiles.filter((f) => selectedFiles.includes(f.name));
    setIsGenerating(true);
    try {
      await onGenerate(filesToGenerate);
      setSelectedFiles([]);
      onClose();
    } catch (error) {
      console.error("Generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[#1C1C1E] border border-white/10 rounded-2xl p-6 z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl text-white">{title}</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* File List */}
            <div className="space-y-2 mb-6 max-h-[400px] overflow-y-auto">
              {uploadedFiles.length === 0 ? (
                <p className="text-gray-400 text-center py-8">
                  No PDFs uploaded. Please upload some files first.
                </p>
              ) : (
                uploadedFiles.map((file, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toggleFile(file.name)}
                    className={`w-full flex items-center justify-between p-4 rounded-lg border transition-all ${
                      selectedFiles.includes(file.name)
                        ? "bg-[#DFF898]/10 border-[#DFF898]"
                        : "bg-white/5 border-white/10 hover:border-white/20"
                    }`}
                  >
                    <span className="text-white truncate flex-1 text-left">
                      {file.name}
                    </span>
                    {selectedFiles.includes(file.name) && (
                      <FileCheck className="w-5 h-5 text-[#DFF898] ml-2" />
                    )}
                  </motion.button>
                ))
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerate}
                disabled={selectedFiles.length === 0 || isGenerating}
                className="flex-1 px-4 py-3 rounded-lg bg-[#DFF898] text-[#1C1C1E] hover:bg-[#DFF898]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <span>Generate ({selectedFiles.length})</span>
                )}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
