import React, { useState, useCallback, useEffect } from "react";
import * as pdfjsLib from "pdfjs-dist";

import InputView from "./components/InputView";
import ResultsView from "./components/ResultsView";
import SelectionDialog from "./components/SelectionDialog";
import {
  generateSummaries,
  generateFlashcards,
  generateQuiz,
} from "./services/geminiService";
import type { GeneratedContent, UploadedFile } from "./types/types";

type View = "input" | "results";

const App: React.FC = () => {
  const [view, setView] = useState<View>("input");
  const [error, setError] = useState<string | null>(null);

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isParsing, setIsParsing] = useState(false);
  const [isSelectionDialogOpen, setIsSelectionDialogOpen] = useState(false);
  const [activeDocumentText, setActiveDocumentText] = useState<string>("");

  const [generatedContent, setGeneratedContent] = useState<GeneratedContent>({
    summaries: null,
    flashcards: null,
    quiz: null,
  });

  const [loadingStates, setLoadingStates] = useState({
    summaries: false,
    flashcards: false,
    quiz: false,
  });

  const isGenerating = Object.values(loadingStates).some(Boolean);

  useEffect(() => {
    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
      "pdfjs-dist/build/pdf.worker.min.js",
      import.meta.url
    ).toString();
  }, []);

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

  const handleGenerate = useCallback(async (text: string) => {
    setActiveDocumentText(text);
    setView("results");
    setError(null);
    setGeneratedContent({ summaries: null, flashcards: null, quiz: null });
    setLoadingStates({ summaries: true, flashcards: true, quiz: true });

    try {
      const summariesPromise = generateSummaries(text);
      const flashcardsPromise = generateFlashcards(text);
      const quizPromise = generateQuiz(text);

      summariesPromise
        .then((summaries) => {
          setGeneratedContent((prev) => ({ ...prev, summaries }));
        })
        .catch((e) => {
          console.error("Error generating summaries:", e);
          setError(
            (prev) =>
              (prev ? prev + "\n" : "") + "Failed to generate summaries."
          );
        })
        .finally(() => {
          setLoadingStates((prev) => ({ ...prev, summaries: false }));
        });

      flashcardsPromise
        .then((flashcards) => {
          setGeneratedContent((prev) => ({ ...prev, flashcards }));
        })
        .catch((e) => {
          console.error("Error generating flashcards:", e);
          setError(
            (prev) =>
              (prev ? prev + "\n" : "") + "Failed to generate flashcards."
          );
        })
        .finally(() => {
          setLoadingStates((prev) => ({ ...prev, flashcards: false }));
        });

      quizPromise
        .then((quiz) => {
          setGeneratedContent((prev) => ({ ...prev, quiz }));
        })
        .catch((e) => {
          console.error("Error generating quiz:", e);
          setError(
            (prev) => (prev ? prev + "\n" : "") + "Failed to generate quiz."
          );
        })
        .finally(() => {
          setLoadingStates((prev) => ({ ...prev, quiz: false }));
        });
    } catch (e) {
      console.error("An unexpected error occurred:", e);
      setError("An unexpected error occurred during generation.");
      setLoadingStates({ summaries: false, flashcards: false, quiz: false });
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

  const handleRequestGenerate = () => {
    if (uploadedFiles.length === 1) {
      handleGenerate(uploadedFiles[0].text);
    } else if (uploadedFiles.length > 1) {
      setIsSelectionDialogOpen(true);
    }
  };

  const handleReset = () => {
    setView("input");
    setUploadedFiles([]);
    setGeneratedContent({ summaries: null, flashcards: null, quiz: null });
    setError(null);
    setActiveDocumentText("");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center font-sans relative overflow-hidden">
      {/* Black & White Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-black/5 rounded-full blur-xl animate-float-slow"></div>
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-black/3 rounded-full blur-xl animate-float-medium"></div>
        <div className="absolute top-1/3 left-1/4 w-40 h-40 bg-black/8 rounded-full blur-lg animate-float-fast"></div>
        <div className="absolute bottom-1/4 right-1/3 w-32 h-32 bg-black/10 rounded-full blur-md animate-float-slow"></div>
      </div>

      <main className="w-full flex-grow flex items-center justify-center p-6 relative z-10">
        {view === "input" ? (
          <InputView
            onFilesUpload={handleFilesUpload}
            onFileDelete={handleFileDelete}
            onRequestGenerate={handleRequestGenerate}
            uploadedFiles={uploadedFiles}
            isParsing={isParsing}
            isGenerating={isGenerating}
          />
        ) : (
          <ResultsView
            content={generatedContent}
            loadingStates={loadingStates}
            onReset={handleReset}
            onRegenerateQuiz={handleRegenerateQuiz}
          />
        )}
      </main>

      <SelectionDialog
        isOpen={isSelectionDialogOpen}
        files={uploadedFiles}
        onClose={() => setIsSelectionDialogOpen(false)}
        onGenerate={handleGenerate}
      />

      {error && (
        <div className="fixed bottom-6 right-6 bg-white text-gray-900 p-6 rounded-2xl shadow-2xl max-w-sm z-50 animate-fade-in-up border border-gray-200">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <h4 className="font-bold text-gray-900">Error</h4>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-gray-500 hover:text-gray-700 transition-colors text-xl font-light leading-none p-1 rounded-full hover:bg-gray-100"
            >
              &times;
            </button>
          </div>
          <pre className="whitespace-pre-wrap text-sm text-gray-700 font-medium">{error}</pre>
        </div>
      )}

      {/* Footer */}
      <footer className="py-6 text-center text-gray-500 text-sm relative z-10">
        <p>AI Study Assistant • Transform PDFs into study materials</p>
      </footer>
    </div>
  );
};

export default App;