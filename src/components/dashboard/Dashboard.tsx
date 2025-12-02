import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { DashboardContent } from "./DashboardContent";
import { useAuth } from "../../hooks/useAuth";
import { saveGeneratedContent, getGeneratedContentHistory } from "../../services/historyService";
import type { UploadedFile, GeneratedContent, HistoryItem } from "../../types/types";
import { useEffect } from "react";

export function Dashboard() {
  const { user } = useAuth();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent>({
    summaries: null,
    flashcards: null,
    quiz: null,
  });
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [activeTab, setActiveTab] = useState<"summary" | "flashcards" | "quiz" | "mastery">("summary");
  const [showHistory, setShowHistory] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadHistory = async () => {
      if (user) {
        const fetchedHistory = await getGeneratedContentHistory(user.uid);
        setHistory(fetchedHistory);
      }
    };
    loadHistory();
  }, [user]);

  const handleSaveHistory = async () => {
    if (!user) {
      alert("Please sign in to save your progress");
      return;
    }

    if (!generatedContent.summaries && !generatedContent.flashcards && !generatedContent.quiz) {
      alert("Nothing to save. Please generate some content first.");
      return;
    }

    setSaving(true);
    
    try {
      const contentToSave: GeneratedContent = {
        summaries: generatedContent.summaries,
        flashcards: generatedContent.flashcards,
        quiz: generatedContent.quiz,
      };
      
      // Save to Firebase
      await saveGeneratedContent(user.uid, contentToSave);
      
      // Re-fetch history to ensure local state is synchronized with Firebase
      const updatedHistory = await getGeneratedContentHistory(user.uid);
      setHistory(updatedHistory);
      alert("Progress saved successfully!");
    } catch (error) {
      console.error("Error saving to Firebase:", error);
      alert("Failed to save progress. Please try again.");
    } finally {
      setSaving(false);
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
        user={user}
        setShowHistory={setShowHistory}
        setActiveTab={setActiveTab}
      />
      <DashboardContent
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        uploadedFiles={uploadedFiles}
        generatedContent={generatedContent}
        setGeneratedContent={setGeneratedContent}
        onSaveHistory={handleSaveHistory}
        history={history}
        onLoadHistory={handleLoadHistory}
        showHistory={showHistory}
        setShowHistory={setShowHistory}
        saving={saving}
      />
    </div>
  );
}
