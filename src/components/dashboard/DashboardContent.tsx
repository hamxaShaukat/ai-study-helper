import { motion } from "motion/react";
import { Save } from "lucide-react";
import { SummaryTab } from "./tabs/SummaryTab";
import { FlashcardsTab } from "./tabs/FlashcardsTab";
import { QuizTab } from "./tabs/QuizTab";
import type { UploadedFile, GeneratedContent } from "../../types/types";

interface DashboardContentProps {
  activeTab: "summary" | "flashcards" | "quiz";
  setActiveTab: (tab: "summary" | "flashcards" | "quiz") => void;
  uploadedFiles: UploadedFile[];
  generatedContent: GeneratedContent;
  setGeneratedContent: (content: GeneratedContent) => void;
  onSaveHistory: () => void;
}

export function DashboardContent({
  activeTab,
  setActiveTab,
  uploadedFiles,
  generatedContent,
  setGeneratedContent,
  onSaveHistory,
}: DashboardContentProps) {
  const tabs = [
    { id: "summary", label: "Summary" },
    { id: "flashcards", label: "Flashcards" },
    { id: "quiz", label: "Quizzes" },
  ] as const;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Tab Navigation */}
      <div className="bg-white/5 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex gap-2">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-2.5 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? "bg-[#DFF898] text-[#1C1C1E]"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {tab.label}
              </motion.button>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onSaveHistory}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-2.5 rounded-lg transition-all border border-white/10"
          >
            <Save className="w-4 h-4" />
            <span>Save History</span>
          </motion.button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "summary" && (
          <SummaryTab
            uploadedFiles={uploadedFiles}
            summaries={generatedContent.summaries}
            setSummaries={(summaries) =>
              setGeneratedContent({ ...generatedContent, summaries })
            }
          />
        )}
        {activeTab === "flashcards" && (
          <FlashcardsTab
            uploadedFiles={uploadedFiles}
            flashcards={generatedContent.flashcards}
            setFlashcards={(flashcards) =>
              setGeneratedContent({ ...generatedContent, flashcards })
            }
          />
        )}
        {activeTab === "quiz" && (
          <QuizTab
            uploadedFiles={uploadedFiles}
            quiz={generatedContent.quiz}
            setQuiz={(quiz) => setGeneratedContent({ ...generatedContent, quiz })}
          />
        )}
      </div>
    </div>
  );
}
