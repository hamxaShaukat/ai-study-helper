import React, { useState, useCallback, useEffect } from "react";
import * as pdfjsLib from "pdfjs-dist";

import InputView from "./components/InputView";
import ResultsView from "./components/ResultsView";
import SelectionDialog from "./components/SelectionDialog";
// import AuthGuard from './components/AuthGuard';
import AuthModal from './components/AuthModal';
import UserProfile from './components/UserProfile';
import { useAuth } from './hooks/useAuth';
import {
  generateSummaries,
  generateFlashcards,
  generateQuiz,
} from "./services/geminiService";
import type { GeneratedContent, UploadedFile } from "./types/types";
import { saveGeneratedContent, getGeneratedContentHistory } from "./services/historyService";
import HistoryView from "./components/HistoryView";

type View = "input" | "results" | "history";


const App: React.FC = () => {
  const [view, setView] = useState<View>("input");
  const [error, setError] = useState<string | null>(null);

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isParsing, setIsParsing] = useState(false);
  const [isSelectionDialogOpen, setIsSelectionDialogOpen] = useState(false);
  const [activeDocumentText, setActiveDocumentText] = useState<string>("");
  const { openAuthModal } = useAuth();
  const { user, loading, showAuthModal } = useAuth();
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent>({
    summaries: null,
    flashcards: null,
    quiz: null,
  });
  const [currentSessionContent, setCurrentSessionContent] = useState<GeneratedContent>({
    summaries: null,
    flashcards: null,
    quiz: null,
  });
  const [userHistory, setUserHistory] = useState<GeneratedContent[]>([]);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [isSavingHistory, setIsSavingHistory] = useState(false);

  const [loadingStates, setLoadingStates] = useState({
    summaries: false,
    flashcards: false,
    quiz: false,
  });

  useEffect(() => {
    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
      "pdfjs-dist/build/pdf.worker.min.js",
      import.meta.url
    ).toString();
  }, []);

  useEffect(() => {
    if (generatedContent) {
      setCurrentSessionContent(generatedContent);
    }
  }, [generatedContent]);

  // Fetch user history when user logs in
  useEffect(() => {
    if (user && !loading) {
      const fetchHistory = async () => {
        try {
          const history = await getGeneratedContentHistory(user.uid);
          setUserHistory(history);
        } catch (e) {
          console.error("Error fetching user history:", e);
        }
      };
      fetchHistory();
    } else if (!user && !loading) {
      // Clear history if user logs out
      setUserHistory([]);
    }
  }, [user, loading, generatedContent]);

  const extractTextFromPdf = async (file: File): Promise<string> => {
    const fileReader = new FileReader();
    return new Promise((resolve, reject) => {
      fileReader.onload = async (event) => {
        try {
          if (!event.target?.result) {
            return reject(new Error("Couldn't read file"));
          }
          const typedArray = new Uint8Array(event.target.result as ArrayBuffer);
          const pdf = await pdfjsLib.getDocument(typedArray).promise;
          let fullText = "";
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items
              .map((item) => ("str" in item ? item.str : ""))
              .join(" ");
            fullText += pageText + "\n";
          }
          resolve(fullText);
        } catch (error) {
          reject(error);
        }
      };
      fileReader.onerror = reject;
      fileReader.readAsArrayBuffer(file);
    });
  };

  const handleFilesUpload = useCallback(
    async (files: FileList) => {
      setIsParsing(true);
      setError(null);

      const newFiles: UploadedFile[] = [];
      const filesToProcess = Array.from(files).filter(
        (file) =>
          !uploadedFiles.some((uploaded) => uploaded.name === file.name) &&
          file.type === "application/pdf"
      );

      if (filesToProcess.length === 0) {
        setIsParsing(false);
        return;
      }

      for (const file of filesToProcess) {
        try {
          const text = await extractTextFromPdf(file);
          newFiles.push({ name: file.name, text });
        } catch (e) {
          console.error(`Error parsing ${file.name}:`, e);
          setError(
            (prev) =>
              (prev ? prev + "\n" : "") + `Failed to parse ${file.name}.`
          );
        }
      }

      setUploadedFiles((prev) => [...prev, ...newFiles]);
      setIsParsing(false);
    },
    [uploadedFiles]
  );

  const handleFileDelete = (fileName: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.name !== fileName));
  };

  const handleGeneratedContentChange = useCallback((newContent: GeneratedContent) => {
    setGeneratedContent(newContent);
  }, []);

  const handleGenerate = useCallback(async (text: string, generationType: 'summaries' | 'flashcards' | 'quiz') => {
    setActiveDocumentText(text);
    setView("results");
    setError(null);
    // Only reset the specific generated content type
    setGeneratedContent((prev) => ({
      ...prev,
      [generationType]: null,
    }));
    setLoadingStates((prev) => ({ ...prev, [generationType]: true }));

    try {
      switch (generationType) {
        case 'summaries':
          const summariesData = await generateSummaries(text);
          setGeneratedContent((prev) => ({ ...prev, summaries: summariesData }));
          break;
        case 'flashcards':
          const flashcardsData = await generateFlashcards(text);
          setGeneratedContent((prev) => ({ ...prev, flashcards: flashcardsData }));
          break;
        case 'quiz':
          const quizData = await generateQuiz(text);
          setGeneratedContent((prev) => ({ ...prev, quiz: quizData }));
          break;
        default:
          throw new Error("Unknown generation type");
      }
    } catch (e) {
      console.error(`Error generating ${generationType}:`, e);
      setError(
        (prev) =>
          (prev ? prev + "\n" : "") + `Failed to generate ${generationType}.`
      );
    } finally {
      setLoadingStates((prev) => ({ ...prev, [generationType]: false }));
    }
  }, []);

  const handleRegenerateQuiz = useCallback(async () => {
    if (!activeDocumentText) return;

    setLoadingStates((prev) => ({ ...prev, quiz: true }));
    setError(null);

    try {
      const quiz = await generateQuiz(activeDocumentText);
      setGeneratedContent((prev) => ({ ...prev, quiz }));
    } catch (e) {
      console.error("Error regenerating quiz:", e);
      setError(
        (prev) => (prev ? prev + "\n" : "") + "Failed to regenerate quiz."
      );
    } finally {
      setLoadingStates((prev) => ({ ...prev, quiz: false }));
    }
  }, [activeDocumentText]);

  const handleRequestGenerate = (generationTypes: ('summaries' | 'flashcards' | 'quiz')[]) => {
    if (uploadedFiles.length === 1) {
      generationTypes.forEach((type) => {
        handleGenerate(uploadedFiles[0].text, type);
      });
    } else if (uploadedFiles.length > 1) {
      setIsSelectionDialogOpen(true);
    }
  };

  const handleBackToCurrentSession = useCallback(() => {
    setGeneratedContent(currentSessionContent);
    setView("results");
  }, [currentSessionContent]);

  const handleSelectHistoryItem = useCallback((item: GeneratedContent) => {
    setGeneratedContent(item);
    setView("results");
  }, []);

  const handleReset = useCallback(() => {
    setUploadedFiles([]);
    setActiveDocumentText("");
    setGeneratedContent({
      summaries: null,
      flashcards: null,
      quiz: null,
    });
    setCurrentSessionContent({
      summaries: null,
      flashcards: null,
      quiz: null,
    });
    setError(null);
    setView("input");
  }, []);

  // Add click handler for the floating button
  const handleSaveProgressClick = async () => {
    console.log('Save Progress button clicked'); // Debug log
    if (!user) {
      openAuthModal();
      setSaveStatus("Please log in to save your progress.");
      return;
    }

    setSaveStatus("Saving...");
    setIsSavingHistory(true);
    try {
      console.log("Generated content before saving:", generatedContent);
      await saveGeneratedContent(user.uid, generatedContent);
      setSaveStatus("Progress saved successfully!");
      // Refresh history after saving
      const updatedHistory = await getGeneratedContentHistory(user.uid);
      setUserHistory(updatedHistory);
    } catch (e) {
      console.error("Error saving progress:", e);
      setSaveStatus("Failed to save progress.");
    } finally {
      setIsSavingHistory(false);
      // Clear status message after 3 seconds
      setTimeout(() => {
        setSaveStatus(null);
      }, 3000);
    }
  };
  
  const AuthDebug = () => {
    const { user, showAuthModal, openAuthModal } = useAuth();
    
    return (
      <div className="fixed top-20 left-4 bg-black/90 text-white p-4 rounded-lg z-50 text-xs font-mono">
        <div>User: {user ? user.email : 'null'}</div>
        <div>Modal: {showAuthModal ? 'OPEN' : 'closed'}</div>
        <button 
          onClick={openAuthModal}
          className="mt-2 bg-white text-black px-2 py-1 rounded text-xs"
        >
          TEST OPEN
        </button>
      </div>
    );
  };
    
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex flex-col font-sans relative overflow-hidden">
      {/* Enhanced Header */}
      <header className="w-full bg-white/90 backdrop-blur-xl border-b border-gray-100/80 shadow-sm z-50 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14v6l9-5m-9 5l-9-5" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  AI Study Helper
                </h1>
                <p className="text-xs text-gray-500 hidden sm:block">Transform PDFs into interactive study materials</p>
              </div>
            </div>
            <UserProfile />
          </div>
        </div>
      </header>
  
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Main gradient orbs */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-200/40 to-pink-200/30 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-blue-200/40 to-cyan-200/30 rounded-full blur-3xl animate-float-medium"></div>
        <div className="absolute top-1/3 left-1/4 w-60 h-60 bg-gradient-to-r from-emerald-200/30 to-teal-200/20 rounded-full blur-2xl animate-float-fast"></div>
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-gradient-to-l from-orange-200/20 to-amber-200/10 rounded-full blur-xl animate-float-slow"></div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>
      </div>
  
      {/* Enhanced Main Content */}
      <main className="w-full grow flex items-center justify-center p-4 sm:p-6 lg:p-8 relative z-10">
        <div className="w-full max-w-6xl mx-auto">
          {view === "input" ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-6 sm:p-8 lg:p-10">
              <InputView
                onFilesUpload={handleFilesUpload}
                onFileDelete={handleFileDelete}
                onRequestGenerate={handleRequestGenerate}
                uploadedFiles={uploadedFiles}
                isParsing={isParsing}
                isGenerating={loadingStates}
              />
            </div>
          ) : view === "results" ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-6 sm:p-8 lg:p-10">
              <ResultsView
                content={generatedContent}
                loadingStates={loadingStates}
                onReset={handleReset}
                onRegenerateQuiz={handleRegenerateQuiz}
                onSaveProgress={handleSaveProgressClick}
                isSaving={isSavingHistory}
                onGeneratedContentChange={handleGeneratedContentChange}
              />
            </div>
          ) : view === "history" ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-6 sm:p-8 lg:p-10">
              <HistoryView 
                history={userHistory} 
                onBackToCurrentSession={handleBackToCurrentSession}
                onSelectHistoryItem={handleSelectHistoryItem}
              />
            </div>
          ) : null}
        </div>
      </main>
      
      
      {/* Enhanced Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col space-y-3">
        {user && (
          <button
            onClick={() => setView("history")}
            className="group bg-gradient-to-br from-indigo-600 to-purple-600 text-white px-6 py-4 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 font-semibold flex items-center gap-3 border border-white/20 hover:border-white/40"
          >
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2-1.343-2-3-2zM12 14c-4 0-7.868 2.01-9 6h18c-1.132-3.99-5-6-9-6z" />
            </svg>
            <span className="hidden sm:inline">View History</span>
            <span className="sm:hidden">History</span>
          </button>
        )}
        <button
          onClick={handleSaveProgressClick}
          disabled={isSavingHistory} // Disable button while saving
          className="group bg-gradient-to-br from-purple-600 to-blue-600 text-white px-6 py-4 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 font-semibold flex items-center gap-3 border border-white/20 hover:border-white/40"
        >
          <div className="relative">
            {isSavingHistory ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            )}
            
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full"></div>
          </div>
          <span className="hidden sm:inline">{isSavingHistory ? "Saving..." : "Save Progress"}</span>
          <span className="sm:hidden">{isSavingHistory ? "Saving..." : "Save"}</span>
        </button>
        {saveStatus && (
          <div className="text-center text-sm font-medium p-2 rounded-lg bg-white/90 shadow-md border border-gray-200">
            {saveStatus}
          </div>
        )}
      </div>
  
      {/* Enhanced Auth Modal */}
      <AuthModal />
      <AuthDebug />
      {/* Enhanced Selection Dialog */}
      <SelectionDialog
        isOpen={isSelectionDialogOpen}
        files={uploadedFiles}
        onClose={() => setIsSelectionDialogOpen(false)}
        onGenerate={handleGenerate}
      />
       <div className="space-y-1">
        <div>Loading: {loading ? 'true' : 'false'}</div>
        <div>User: {user ? user.email : 'null'}</div>
        <div>Modal State: {showAuthModal ? 'OPEN' : 'closed'}</div>
      </div>
      {/* Enhanced Error Notification */}
      {error && (
        <div className="fixed bottom-6 left-6 right-6 sm:right-auto sm:left-6 max-w-sm z-50 animate-slide-in-up">
          <div className="bg-white/95 backdrop-blur-xl text-gray-900 p-6 rounded-2xl shadow-2xl border border-red-200/50">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <h4 className="font-bold text-gray-900 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Attention Required
                </h4>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors text-xl font-light leading-none p-2 rounded-full hover:bg-gray-100/80"
              >
                &times;
              </button>
            </div>
            <pre className="whitespace-pre-wrap text-sm text-gray-700 font-medium bg-gray-50/50 p-3 rounded-lg border border-gray-200/50">
              {error}
            </pre>
          </div>
        </div>
      )}
  
      {/* Enhanced Footer */}
      <footer className="py-8 text-center relative z-10 bg-gradient-to-t from-white/80 to-transparent">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-2 text-gray-600">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <span className="text-sm font-medium">AI Powered Learning</span>
            </div>
            
            <p className="text-gray-500 text-sm font-medium">
              Transform PDFs into interactive study materials
            </p>
            
            <div className="flex items-center space-x-2 text-gray-400">
              <span className="text-xs">Built with</span>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-75"></div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse delay-150"></div>
              </div>
            </div>
          </div>
          
          {/* Feature badges */}
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            {['PDF Processing', 'AI Summaries', 'Smart Flashcards', 'Interactive Quizzes'].map((feature, index) => (
              <div
                key={feature}
                className="bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-full px-4 py-2 text-xs font-medium text-gray-600 shadow-sm hover:shadow-md transition-shadow"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {feature}
              </div>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;