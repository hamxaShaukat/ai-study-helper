import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { DashboardContent } from "./DashboardContent";
import type { UploadedFile, GeneratedContent, HistoryItem } from "../../types/types";

export function Dashboard() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent>({
    summaries: null,
    flashcards: null,
    quiz: null,
  });
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [activeTab, setActiveTab] = useState<"summary" | "flashcards" | "quiz">("summary");

  const handleSaveHistory = () => {
    if (generatedContent.summaries || generatedContent.flashcards || generatedContent.quiz) {
      const newHistoryItem: HistoryItem = {
        id: Date.now().toString(),
        name: `Session ${new Date().toLocaleString()}`,
        content: { ...generatedContent, timestamp: new Date() },
        timestamp: new Date(),
      };
      setHistory([newHistoryItem, ...history]);
      // Here you would also save to Firebase
      console.log("Saved to history:", newHistoryItem);
    }
  };

  const handleLoadHistory = (item: HistoryItem) => {
    setGeneratedContent(item.content);
  };

  return (
    <div className="flex h-screen bg-[#1C1C1E] overflow-hidden">
      <Sidebar
        uploadedFiles={uploadedFiles}
        setUploadedFiles={setUploadedFiles}
        history={history}
        onLoadHistory={handleLoadHistory}
      />
      <DashboardContent
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        uploadedFiles={uploadedFiles}
        generatedContent={generatedContent}
        setGeneratedContent={setGeneratedContent}
        onSaveHistory={handleSaveHistory}
      />
    </div>
  );
}
