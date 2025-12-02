import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, AlertCircle } from "lucide-react";
import { PDFSelectionDialog } from "../PDFSelectionDialog";
import { generateQuiz } from "../../../services/geminiService";
import { saveMasteryProgress, getMasteryProgressHistory } from "../../../services/masteryService";
import type { UploadedFile, Quiz, MCQ, MasteryProgress } from "../../../types/types";
import { useAuth } from "../../../hooks/useAuth";

interface MasteryTabProps {
  uploadedFiles: UploadedFile[];
}

export function MasteryTab({ uploadedFiles }: MasteryTabProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [masteryHistory, setMasteryHistory] = useState<MasteryProgress[]>([]);
  const [currentDocumentNames, setCurrentDocumentNames] = useState<string[]>([]);
  const [showFinalResults, setShowFinalResults] = useState(false);
  const [wronglyAnswered, setWronglyAnswered] = useState<MCQ[]>([]);

  const { user } = useAuth();

  useEffect(() => {
    const fetchHistory = async () => {
      if (user?.uid) {
        const history = await getMasteryProgressHistory(user.uid);
        setMasteryHistory(history);
      }
    };
    fetchHistory();
  }, [user]);

  const handleGenerateNewQuiz = async (selectedFiles: UploadedFile[]) => {
    if (selectedFiles.length === 0) {
      setError("Please select at least one PDF");
      return;
    }

    setIsGenerating(true);
    setError(null);
    try {
      const combinedText = selectedFiles.map(f => f.text).join("\n\n");
      const generatedQuiz = await generateQuiz(combinedText);
      setCurrentQuiz(generatedQuiz);
      setCurrentQuestion(0);
      setSelectedAnswer(null);
      setScore(0);
      setWronglyAnswered([]);
      setShowFinalResults(false);

      const newDocumentNames = selectedFiles.map(f => f.name).sort();
      setCurrentDocumentNames(newDocumentNames);

      // Fetch the latest history before checking for previous attempts
      const latestHistory = user?.uid ? await getMasteryProgressHistory(user.uid) : [];
      const previousAttempt = latestHistory.find(
        (item) => JSON.stringify(item.documentNames.sort()) === JSON.stringify(newDocumentNames)
      );
      setAttempts(previousAttempt ? previousAttempt.attempts + 1 : 1);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to generate quiz";
      setError(errorMessage);
      console.error("Error generating quiz:", err);
    } finally {
      setIsGenerating(false);
      setIsDialogOpen(false);
    }
  };

  const handleAnswerSelection = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = async () => {
    if (!currentQuiz || !user?.uid) return;

    const mcq = currentQuiz.mcqs[currentQuestion];
    if (selectedAnswer !== mcq.answer) {
      setWronglyAnswered(prev => [...prev, mcq]);
    }

    if (currentQuestion < currentQuiz.mcqs.length - 1) {
      if (selectedAnswer === mcq.answer) {
        setScore(prev => prev + 1);
      }
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
    } else {
      // Quiz finished, check score and potentially regenerate
      if (selectedAnswer === mcq.answer) {
        setScore(prev => prev + 1);
      }

      const finalScore = (score / currentQuiz.mcqs.length) * 100;

      await saveMasteryProgress(user.uid, { score: finalScore, attempts, documentNames: currentDocumentNames });
      const updatedHistory = await getMasteryProgressHistory(user.uid);
      setMasteryHistory(updatedHistory);

      setShowFinalResults(true);
    }
  };

  const handleRestartSession = () => {
    setCurrentQuiz(null);
    setScore(0);
    setAttempts(0);
    setCurrentDocumentNames([]);
    setShowFinalResults(false);
    setWronglyAnswered([]);
  }

  const motivationalQuotes = [
    "Every expert was once a beginner.",
    "The only way to do great work is to love what you do.",
    "Success is the sum of small efforts repeated day in and day out.",
    "Believe you can and you're halfway there.",
    "The future belongs to those who believe in the beauty of their dreams.",
  ];

  const getRandomQuote = () => {
    return motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl text-white mb-2">Road towards Mastery</h1>
        <p className="text-gray-400 mb-8">Achieve 90% mastery on MCQs!</p>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        {!currentQuiz ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-12 text-center"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-[#DFF898]/10 rounded-full mb-6">
              <Sparkles className="w-10 h-10 text-[#DFF898]" />
            </div>
            <h2 className="text-2xl text-white mb-3">Start Mastery Session</h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Begin your journey to mastery by taking quizzes until you achieve 90% on MCQs.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsDialogOpen(true)}
              disabled={isGenerating}
              className="bg-[#DFF898] text-[#1C1C1E] px-8 py-4 rounded-lg hover:bg-[#DFF898]/90 transition-all inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Sparkles className="w-5 h-5" />
              <span>{isGenerating ? "Generating..." : "Start Mastery Session"}</span>
            </motion.button>
          </motion.div>
        ) : (
          <>
            {!showFinalResults ? (
              <div>
                {/* Quiz Content */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                  <h2 className="text-xl text-white mb-4">
                    Question {currentQuestion + 1}/{currentQuiz.mcqs.length}
                  </h2>
                  <p className="text-gray-200 text-lg mb-6">
                    {currentQuiz.mcqs[currentQuestion].question}
                  </p>
                  <div className="space-y-4">
                    {currentQuiz.mcqs[currentQuestion].options.map((option, idx) => (
                      <motion.button
                        key={idx}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleAnswerSelection(option)}
                        className={`w-full text-left p-4 rounded-lg transition-all border ${
                          selectedAnswer === option
                            ? "bg-[#DFF898] text-[#1C1C1E] border-[#DFF898]"
                            : "bg-white/5 border-white/10 text-gray-200 hover:bg-white/10"
                        }`}
                      >
                        {option}
                      </motion.button>
                    ))}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleNextQuestion}
                    disabled={selectedAnswer === null}
                    className="mt-8 w-full bg-[#DFF898] text-[#1C1C1E] px-8 py-4 rounded-lg hover:bg-[#DFF898]/90 transition-all inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>{currentQuestion === currentQuiz.mcqs.length - 1 ? "Finish Quiz" : "Next Question"}</span>
                  </motion.button>
                </div>
              </div>
            ) : (
              /* Final Results */
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center"
              >
                <h2 className="text-2xl text-white mb-4">Quiz Completed!</h2>
                <p className="text-gray-400 text-lg mb-2">Your Score: {(score / currentQuiz.mcqs.length * 100).toFixed(2)}%</p>
                <p className="text-[#DFF898] text-md italic mb-6">"{getRandomQuote()}"</p>
                
                {wronglyAnswered.length > 0 && (
                  <div className="text-left mt-8 p-4 bg-white/5 rounded-lg">
                    <h3 className="text-xl text-white mb-3">Review Incorrect Answers:</h3>
                    {wronglyAnswered.map((mcq, index) => (
                      <div key={index} className="mb-4 border-b border-white/10 pb-4 last:border-b-0 last:pb-0">
                        <p className="text-gray-200 font-semibold mb-2">Q: {mcq.question}</p>
                        <p className="text-red-300 mb-1">Your Answer: <span className="font-bold">{mcq.options.find(opt => opt === selectedAnswer)}</span></p>
                        <p className="text-green-300">Correct Answer: <span className="font-bold">{mcq.answer}</span></p>
                      </div>
                    ))}
                  </div>
                )}

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleRestartSession}
                  className="mt-8 bg-[#DFF898] text-[#1C1C1E] px-8 py-4 rounded-lg hover:bg-[#DFF898]/90 transition-all inline-flex items-center gap-2"
                >
                  Start New Mastery Session
                </motion.button>
              </motion.div>
            )}
          </>
        )}

        {masteryHistory.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl text-white mb-4">Past Mastery Attempts</h2>
            <div className="space-y-3">
              {masteryHistory.map((item, index) => (
                <div key={index} className="bg-white/5 border border-white/10 rounded-lg p-4 flex items-center justify-between">
                  <p className="text-gray-200">Attempt {item.attempts} with {item.documentNames.join(', ')}: {item.score.toFixed(2)}%</p>
                  <p className="text-gray-400 text-sm">{new Date(item.timestamp).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <PDFSelectionDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          uploadedFiles={uploadedFiles}
          onGenerate={handleGenerateNewQuiz}
          title="Select PDFs for Mastery Quiz"
        />
      </div>
    </div>
  );
}
