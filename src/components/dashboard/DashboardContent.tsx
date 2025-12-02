import { motion } from "framer-motion";
import { Save } from "lucide-react";
import { SummaryTab } from "./tabs/SummaryTab";
import { FlashcardsTab } from "./tabs/FlashcardsTab";
import { QuizTab } from "./tabs/QuizTab";
import { MasteryTab } from "./tabs/MasteryTab";
import HistoryView from "../HistoryView";
import type { UploadedFile, GeneratedContent, HistoryItem } from "../../types/types";

interface DashboardContentProps {
  activeTab: "summary" | "flashcards" | "quiz" | "mastery";
  setActiveTab: (tab: "summary" | "flashcards" | "quiz" | "mastery") => void;
  uploadedFiles: UploadedFile[];
  generatedContent: GeneratedContent;
  setGeneratedContent: (content: GeneratedContent) => void;
  onSaveHistory: () => void;
  history: HistoryItem[];
  onLoadHistory: (item: HistoryItem) => void;
  showHistory: boolean;
  setShowHistory: (show: boolean) => void;
  saving: boolean;
}

export function DashboardContent({
  activeTab,
  setActiveTab,
  uploadedFiles,
  generatedContent,
  setGeneratedContent,
  onSaveHistory,
  history,
  onLoadHistory,
  showHistory,
  setShowHistory,
  saving,
}: DashboardContentProps) {
  const tabs = [
    { id: "summary", label: "Summary" },
    { id: "flashcards", label: "Flashcards" },
    { id: "quiz", label: "Quizzes" },
    { id: "mastery", label: "Road towards Mastery" },
  ] as const;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Tab Navigation */}
      <div className="bg-white/5 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between px-6 py-4">
          {showHistory ? (
            <motion.button
              className="px-6 py-2.5 rounded-lg bg-[#DFF898] text-[#1C1C1E]"
              disabled
            >
              History
            </motion.button>
          ) : (
            <>
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
                disabled={saving}
              >
                <Save className="w-4 h-4" />
                <span>{saving ? "Saving..." : "Save History"}</span>
              </motion.button>
            </>
          )}
        </div>
      </div>

      {/* Tab Content */}
      {showHistory ? (
        <HistoryView
          history={history}
          onBackToCurrentSession={() => setShowHistory(false)}
          onSelectHistoryItem={(item) => {
            onLoadHistory(item);
            setShowHistory(false);
          }}
        />
      ) : (
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
              setQuiz={(quiz) =>
                setGeneratedContent({ ...generatedContent, quiz })
              }
            />
          )}
          {activeTab === "mastery" && (
            <MasteryTab uploadedFiles={uploadedFiles} />
          )}
        </div>
      )}
    </div>
  );
}
