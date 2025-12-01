import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, ChevronRight, History, FileText, Upload, X, BookOpen } from "lucide-react";
import type { UploadedFile, HistoryItem } from "../../types/types";

interface SidebarProps {
  uploadedFiles: UploadedFile[];
  setUploadedFiles: (files: UploadedFile[]) => void;
  history: HistoryItem[];
  onLoadHistory: (item: HistoryItem) => void;
}

export function Sidebar({ uploadedFiles, setUploadedFiles, history, onLoadHistory }: SidebarProps) {
  const [isHistoryOpen, setIsHistoryOpen] = useState(true);
  const [isPdfsOpen, setIsPdfsOpen] = useState(true);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const text = event.target?.result as string;
          const newFile: UploadedFile = {
            name: file.name,
            text: text,
          };
          setUploadedFiles([...uploadedFiles, newFile]);
        };
        reader.readAsText(file);
      });
    }
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      className="w-80 bg-white/5 backdrop-blur-xl border-r border-white/10 flex flex-col"
    >
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="bg-[#DFF898] p-2 rounded-lg">
            <BookOpen className="w-6 h-6 text-[#1C1C1E]" />
          </div>
          <span className="text-xl text-white">StudyAI</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* History Section */}
        <div>
          <button
            onClick={() => setIsHistoryOpen(!isHistoryOpen)}
            className="w-full flex items-center justify-between text-white hover:text-[#DFF898] transition-colors p-2 rounded-lg hover:bg-white/5"
          >
            <div className="flex items-center gap-2">
              <History className="w-5 h-5" />
              <span>History</span>
            </div>
            {isHistoryOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>

          <AnimatePresence>
            {isHistoryOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="ml-7 mt-2 space-y-1"
              >
                {history.length === 0 ? (
                  <p className="text-gray-500 text-sm p-2">No history yet</p>
                ) : (
                  history.map((item) => (
                    <motion.button
                      key={item.id}
                      whileHover={{ x: 5 }}
                      onClick={() => onLoadHistory(item)}
                      className="w-full text-left text-sm text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors truncate"
                    >
                      {item.name}
                    </motion.button>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* PDFs Section */}
        <div>
          <button
            onClick={() => setIsPdfsOpen(!isPdfsOpen)}
            className="w-full flex items-center justify-between text-white hover:text-[#DFF898] transition-colors p-2 rounded-lg hover:bg-white/5"
          >
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              <span>PDFs</span>
              {uploadedFiles.length > 0 && (
                <span className="bg-[#DFF898] text-[#1C1C1E] text-xs px-2 py-0.5 rounded-full">
                  {uploadedFiles.length}
                </span>
              )}
            </div>
            {isPdfsOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>

          <AnimatePresence>
            {isPdfsOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="ml-7 mt-2 space-y-2"
              >
                <label className="flex items-center gap-2 text-sm text-[#DFF898] hover:text-[#DFF898]/80 cursor-pointer p-2 rounded-lg hover:bg-white/5 transition-colors">
                  <Upload className="w-4 h-4" />
                  <span>Upload PDF</span>
                  <input
                    type="file"
                    accept=".pdf,.txt"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                {uploadedFiles.length === 0 ? (
                  <p className="text-gray-500 text-sm p-2">No files uploaded</p>
                ) : (
                  uploadedFiles.map((file, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between text-sm text-gray-400 p-2 rounded-lg hover:bg-white/5 group"
                    >
                      <span className="truncate flex-1">{file.name}</span>
                      <button
                        onClick={() => handleRemoveFile(index)}
                        className="opacity-0 group-hover:opacity-100 hover:text-red-400 transition-all"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer with stats */}
      <div className="p-4 border-t border-white/10">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-[#DFF898] text-xl">{uploadedFiles.length}</div>
            <div className="text-gray-400 text-xs">Files</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-[#DFF898] text-xl">{history.length}</div>
            <div className="text-gray-400 text-xs">Sessions</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
