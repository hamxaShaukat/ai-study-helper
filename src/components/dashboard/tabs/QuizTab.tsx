import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, CheckCircle, XCircle, RotateCcw } from "lucide-react";
import { PDFSelectionDialog } from "../PDFSelectionDialog";
import type { UploadedFile, Quiz } from "../../../types/types";

interface QuizTabProps {
  uploadedFiles: UploadedFile[];
  quiz: Quiz | null;
  setQuiz: (quiz: Quiz) => void;
}

export function QuizTab({ uploadedFiles, quiz, setQuiz }: QuizTabProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
  const [showResults, setShowResults] = useState(false);
  const [quizType, setQuizType] = useState<"mcq" | "short">("mcq");

  const handleGenerate = async (selectedFiles: UploadedFile[]) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    const mockQuiz: Quiz = {
      mcqs: [
        {
          question: "What is the primary purpose of machine learning?",
          options: [
            "To replace human intelligence",
            "To enable systems to learn from data",
            "To create video games",
            "To design websites",
          ],
          answer: "To enable systems to learn from data",
        },
        {
          question: "Which of the following is NOT a type of machine learning?",
          options: [
            "Supervised Learning",
            "Unsupervised Learning",
            "Reinforcement Learning",
            "Quantum Learning",
          ],
          answer: "Quantum Learning",
        },
        {
          question: "What does AI stand for?",
          options: [
            "Automated Intelligence",
            "Artificial Intelligence",
            "Advanced Information",
            "Algorithmic Integration",
          ],
          answer: "Artificial Intelligence",
        },
      ],
      short_questions: [
        "Explain the difference between supervised and unsupervised learning.",
        "What are the main challenges in implementing machine learning systems?",
        "Describe a real-world application of artificial intelligence.",
      ],
    };
    
    setQuiz(mockQuiz);
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setShowResults(false);
  };

  const handleSelectAnswer = (answer: string) => {
    setSelectedAnswers({ ...selectedAnswers, [currentQuestion]: answer });
  };

  const handleSubmitQuiz = () => {
    setShowResults(true);
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setShowResults(false);
  };

  const calculateScore = () => {
    if (!quiz) return 0;
    let correct = 0;
    quiz.mcqs.forEach((mcq, index) => {
      if (selectedAnswers[index] === mcq.answer) {
        correct++;
      }
    });
    return (correct / quiz.mcqs.length) * 100;
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl text-white mb-2">Quiz</h1>
          <p className="text-gray-400">Test your knowledge with AI-generated questions</p>
        </div>

        {!quiz ? (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-12 text-center"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-[#DFF898]/10 rounded-full mb-6">
              <Sparkles className="w-10 h-10 text-[#DFF898]" />
            </div>
            <h2 className="text-2xl text-white mb-3">Generate a Quiz</h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Create custom quizzes to test your understanding of the material
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsDialogOpen(true)}
              className="bg-[#DFF898] text-[#1C1C1E] px-8 py-4 rounded-lg hover:bg-[#DFF898]/90 transition-all inline-flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              <span>Generate Quiz</span>
            </motion.button>
          </motion.div>
        ) : (
          /* Content State */
          <div className="space-y-6">
            {/* Quiz Type Selector */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setQuizType("mcq");
                  setCurrentQuestion(0);
                  setShowResults(false);
                }}
                className={`flex-1 p-4 rounded-lg border transition-all ${
                  quizType === "mcq"
                    ? "bg-[#DFF898]/10 border-[#DFF898]"
                    : "bg-white/5 border-white/10 hover:border-white/20"
                }`}
              >
                <div className={`text-sm ${quizType === "mcq" ? "text-[#DFF898]" : "text-white"}`}>
                  Multiple Choice
                </div>
                <div className="text-xs text-gray-400">{quiz.mcqs.length} questions</div>
              </button>
              <button
                onClick={() => {
                  setQuizType("short");
                  setCurrentQuestion(0);
                }}
                className={`flex-1 p-4 rounded-lg border transition-all ${
                  quizType === "short"
                    ? "bg-[#DFF898]/10 border-[#DFF898]"
                    : "bg-white/5 border-white/10 hover:border-white/20"
                }`}
              >
                <div className={`text-sm ${quizType === "short" ? "text-[#DFF898]" : "text-white"}`}>
                  Short Answer
                </div>
                <div className="text-xs text-gray-400">{quiz.short_questions.length} questions</div>
              </button>
            </div>

            {quizType === "mcq" && !showResults && (
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuestion}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {/* Progress */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">
                      Question {currentQuestion + 1} of {quiz.mcqs.length}
                    </span>
                    <div className="bg-white/5 rounded-full h-2 w-48 overflow-hidden">
                      <div
                        className="h-full bg-[#DFF898] transition-all"
                        style={{
                          width: `${((currentQuestion + 1) / quiz.mcqs.length) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Question */}
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                    <h3 className="text-xl text-white mb-6">
                      {quiz.mcqs[currentQuestion].question}
                    </h3>

                    {/* Options */}
                    <div className="space-y-3">
                      {quiz.mcqs[currentQuestion].options.map((option, index) => (
                        <motion.button
                          key={index}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleSelectAnswer(option)}
                          className={`w-full text-left p-4 rounded-lg border transition-all ${
                            selectedAnswers[currentQuestion] === option
                              ? "bg-[#DFF898]/10 border-[#DFF898]"
                              : "bg-white/5 border-white/10 hover:border-white/20"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                selectedAnswers[currentQuestion] === option
                                  ? "border-[#DFF898] bg-[#DFF898]"
                                  : "border-white/20"
                              }`}
                            >
                              {selectedAnswers[currentQuestion] === option && (
                                <div className="w-2 h-2 bg-[#1C1C1E] rounded-full" />
                              )}
                            </div>
                            <span className="text-white">{option}</span>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Navigation */}
                  <div className="flex justify-between">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                      disabled={currentQuestion === 0}
                      className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      Previous
                    </motion.button>

                    {currentQuestion === quiz.mcqs.length - 1 ? (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSubmitQuiz}
                        className="px-8 py-3 bg-[#DFF898] text-[#1C1C1E] rounded-lg hover:bg-[#DFF898]/90 transition-all"
                      >
                        Submit Quiz
                      </motion.button>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() =>
                          setCurrentQuestion(Math.min(quiz.mcqs.length - 1, currentQuestion + 1))
                        }
                        className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white transition-all"
                      >
                        Next
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            )}

            {quizType === "mcq" && showResults && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                {/* Score */}
                <div className="bg-gradient-to-br from-[#DFF898]/20 to-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center">
                  <h2 className="text-3xl text-white mb-2">Quiz Complete!</h2>
                  <div className="text-6xl text-[#DFF898] mb-2">{calculateScore().toFixed(0)}%</div>
                  <p className="text-gray-400">
                    You got {Object.values(selectedAnswers).filter((ans, idx) => ans === quiz.mcqs[idx].answer).length} out of {quiz.mcqs.length} correct
                  </p>
                </div>

                {/* Review */}
                <div className="space-y-4">
                  {quiz.mcqs.map((mcq, index) => {
                    const isCorrect = selectedAnswers[index] === mcq.answer;
                    return (
                      <div
                        key={index}
                        className={`bg-white/5 backdrop-blur-sm border rounded-xl p-6 ${
                          isCorrect ? "border-green-500/30" : "border-red-500/30"
                        }`}
                      >
                        <div className="flex items-start gap-3 mb-3">
                          {isCorrect ? (
                            <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                          ) : (
                            <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                          )}
                          <div className="flex-1">
                            <p className="text-white mb-2">{mcq.question}</p>
                            <div className="space-y-2 text-sm">
                              <p className="text-gray-400">
                                Your answer: <span className={isCorrect ? "text-green-500" : "text-red-500"}>{selectedAnswers[index] || "Not answered"}</span>
                              </p>
                              {!isCorrect && (
                                <p className="text-gray-400">
                                  Correct answer: <span className="text-green-500">{mcq.answer}</span>
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleRestart}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white transition-all"
                  >
                    <RotateCcw className="w-5 h-5" />
                    <span>Retake Quiz</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsDialogOpen(true)}
                    className="flex-1 px-6 py-3 bg-[#DFF898] text-[#1C1C1E] rounded-lg hover:bg-[#DFF898]/90 transition-all"
                  >
                    Generate New Quiz
                  </motion.button>
                </div>
              </motion.div>
            )}

            {quizType === "short" && (
              <div className="space-y-4">
                {quiz.short_questions.map((question, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
                  >
                    <div className="mb-3">
                      <span className="text-[#DFF898] text-sm">Question {index + 1}</span>
                      <h3 className="text-white mt-2">{question}</h3>
                    </div>
                    <textarea
                      placeholder="Type your answer here..."
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white placeholder:text-gray-500 focus:border-[#DFF898] focus:outline-none transition-colors resize-none"
                      rows={4}
                    />
                  </motion.div>
                ))}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-6 py-3 bg-[#DFF898] text-[#1C1C1E] rounded-lg hover:bg-[#DFF898]/90 transition-all"
                >
                  Submit Answers
                </motion.button>
              </div>
            )}

            {/* Generate New */}
            {quizType === "mcq" && !showResults && (
              <button
                onClick={() => setIsDialogOpen(true)}
                className="w-full text-sm text-[#DFF898] hover:text-[#DFF898]/80 transition-colors"
              >
                Generate New Quiz
              </button>
            )}
          </div>
        )}

        {/* PDF Selection Dialog */}
        <PDFSelectionDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          uploadedFiles={uploadedFiles}
          onGenerate={handleGenerate}
          title="Select PDFs for Quiz"
        />
      </div>
    </div>
  );
}
