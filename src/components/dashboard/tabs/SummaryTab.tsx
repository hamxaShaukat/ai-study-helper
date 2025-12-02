import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Copy, Check, AlertCircle } from "lucide-react";
import { PDFSelectionDialog } from "../PDFSelectionDialog";
import { generateSummaries } from "../../../services/geminiService";
import type { UploadedFile, Summaries } from "../../../types/types";

interface SummaryTabProps {
  uploadedFiles: UploadedFile[];
  summaries: Summaries | null;
  setSummaries: (summaries: Summaries) => void;
}

export function SummaryTab({ uploadedFiles, summaries, setSummaries }: SummaryTabProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedLength, setSelectedLength] = useState<"short" | "medium" | "long">("medium");
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (selectedFiles: UploadedFile[]) => {
    if (selectedFiles.length === 0) {
      setError("Please select at least one PDF");
      return;
    }

    setIsGenerating(true);
    setError(null);
    try {
      const combinedText = selectedFiles.map(f => f.text).join("\n\n");
      const generatedSummaries = await generateSummaries(combinedText);
      setSummaries(generatedSummaries);
      setIsDialogOpen(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to generate summaries";
      setError(errorMessage);
      console.error("Error generating summaries:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const lengthOptions = [
    { id: "short", label: "Short", description: "Quick overview" },
    { id: "medium", label: "Medium", description: "Balanced detail" },
    { id: "long", label: "Long", description: "Comprehensive" },
  ] as const;

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl text-white mb-2">AI Summary</h1>
          <p className="text-gray-400">Generate concise summaries from your PDFs</p>
        </div>

        {!summaries ? (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-12 text-center"
          >
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-300">{error}</p>
              </div>
            )}
            <div className="inline-flex items-center justify-center w-20 h-20 bg-[#DFF898]/10 rounded-full mb-6">
              <Sparkles className="w-10 h-10 text-[#DFF898]" />
            </div>
            <h2 className="text-2xl text-white mb-3">Generate Your First Summary</h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Select your PDFs and let AI create intelligent summaries tailored to your needs
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsDialogOpen(true)}
              disabled={isGenerating}
              className="bg-[#DFF898] text-[#1C1C1E] px-8 py-4 rounded-lg hover:bg-[#DFF898]/90 transition-all inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Sparkles className="w-5 h-5" />
              <span>{isGenerating ? "Generating..." : "Generate Summary"}</span>
            </motion.button>
          </motion.div>
        ) : (
          /* Content State */
          <div className="space-y-6">
            {/* Length Selector */}
            <div className="flex gap-3">
              {lengthOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSelectedLength(option.id)}
                  className={`flex-1 p-4 rounded-lg border transition-all ${
                    selectedLength === option.id
                      ? "bg-[#DFF898]/10 border-[#DFF898]"
                      : "bg-white/5 border-white/10 hover:border-white/20"
                  }`}
                >
                  <div className={`text-sm mb-1 ${selectedLength === option.id ? "text-[#DFF898]" : "text-white"}`}>
                    {option.label}
                  </div>
                  <div className="text-xs text-gray-400">{option.description}</div>
                </button>
              ))}
            </div>

            {/* Summary Display */}
            <motion.div
              key={selectedLength}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl text-white capitalize">{selectedLength} Summary</h3>
                <button
                  onClick={() => handleCopy(summaries[selectedLength], selectedLength)}
                  className="flex items-center gap-2 text-gray-400 hover:text-[#DFF898] transition-colors"
                >
                  {copiedType === selectedLength ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span className="text-sm">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span className="text-sm">Copy</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                {summaries[selectedLength]}
              </p>
            </motion.div>

            {/* Regenerate Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsDialogOpen(true)}
              className="w-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#DFF898] text-white px-6 py-3 rounded-lg transition-all"
            >
              Regenerate Summary
            </motion.button>
          </div>
        )}

        {/* PDF Selection Dialog */}
        <PDFSelectionDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          uploadedFiles={uploadedFiles}
          onGenerate={handleGenerate}
          title="Select PDFs for Summary"
        />
      </div>
    </div>
  );
}
