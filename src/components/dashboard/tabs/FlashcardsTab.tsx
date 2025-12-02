import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ChevronLeft, ChevronRight, RotateCcw, AlertCircle } from "lucide-react";
import { PDFSelectionDialog } from "../PDFSelectionDialog";
import { generateFlashcards } from "../../../services/geminiService";
import type { UploadedFile, Flashcard } from "../../../types/types";

interface FlashcardsTabProps {
  uploadedFiles: UploadedFile[];
  flashcards: Flashcard[] | null;
  setFlashcards: (flashcards: Flashcard[]) => void;
}

export function FlashcardsTab({ uploadedFiles, flashcards, setFlashcards }: FlashcardsTabProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (selectedFiles: UploadedFile[]) => {
    if (selectedFiles.length === 0) {
      setError("Please select at least one PDF");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setIsFlipped(false);
    try {
      const combinedText = selectedFiles.map(f => f.text).join("\n\n");
      const generatedFlashcards = await generateFlashcards(combinedText);
      setFlashcards(generatedFlashcards);
      setCurrentIndex(0);
      setIsDialogOpen(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to generate flashcards";
      setError(errorMessage);
      console.error("Error generating flashcards:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const nextCard = () => {
    if (flashcards && currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const prevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl text-white mb-2">Flashcards</h1>
          <p className="text-gray-400">Master concepts with AI-generated flashcards</p>
        </div>

        {!flashcards ? (
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
            <h2 className="text-2xl text-white mb-3">Generate Flashcards</h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Create interactive flashcards to help memorize key concepts
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsDialogOpen(true)}
              disabled={isGenerating}
              className="bg-[#DFF898] text-[#1C1C1E] px-8 py-4 rounded-lg hover:bg-[#DFF898]/90 transition-all inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Sparkles className="w-5 h-5" />
              <span>{isGenerating ? "Generating..." : "Generate Flashcards"}</span>
            </motion.button>
          </motion.div>
        ) : (
          /* Content State */
          <div className="space-y-6">
            {/* Progress */}
            <div className="flex items-center justify-between">
              <span className="text-gray-400">
                Card {currentIndex + 1} of {flashcards.length}
              </span>
              <button
                onClick={() => setIsDialogOpen(true)}
                className="text-sm text-[#DFF898] hover:text-[#DFF898]/80 transition-colors"
              >
                Generate New Set
              </button>
            </div>

            {/* Flashcard */}
            <div className="relative h-[400px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ rotateY: 0 }}
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.6 }}
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="absolute inset-0 cursor-pointer"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Front */}
                  <div
                    className="absolute inset-0 bg-gradient-to-br from-[#DFF898]/20 to-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center"
                    style={{ backfaceVisibility: "hidden" }}
                  >
                    <div className="text-sm text-[#DFF898] mb-4">Question</div>
                    <p className="text-2xl text-white text-center">
                      {flashcards[currentIndex].front}
                    </p>
                    <div className="absolute bottom-6 text-sm text-gray-400">
                      Click to reveal answer
                    </div>
                  </div>

                  {/* Back */}
                  <div
                    className="absolute inset-0 bg-gradient-to-br from-white/5 to-[#DFF898]/20 backdrop-blur-sm border border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center"
                    style={{
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                    }}
                  >
                    <div className="text-sm text-[#DFF898] mb-4">Answer</div>
                    <p className="text-xl text-white text-center leading-relaxed">
                      {flashcards[currentIndex].back}
                    </p>
                    <div className="absolute bottom-6 text-sm text-gray-400">
                      Click to see question
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={prevCard}
                disabled={currentIndex === 0}
                className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
                <span>Previous</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setCurrentIndex(0);
                  setIsFlipped(false);
                }}
                className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white transition-all"
              >
                <RotateCcw className="w-5 h-5" />
                <span>Restart</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={nextCard}
                disabled={currentIndex === flashcards.length - 1}
                className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <span>Next</span>
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Progress Bar */}
            <div className="bg-white/5 rounded-full h-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${((currentIndex + 1) / flashcards.length) * 100}%`,
                }}
                className="h-full bg-[#DFF898]"
              />
            </div>
          </div>
        )}

        {/* PDF Selection Dialog */}
        <PDFSelectionDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          uploadedFiles={uploadedFiles}
          onGenerate={handleGenerate}
          title="Select PDFs for Flashcards"
        />
      </div>
    </div>
  );
}
