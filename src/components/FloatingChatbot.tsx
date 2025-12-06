import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, Bot, User, X, AlertCircle } from "lucide-react";
import { PDFSelectionDialog } from "./dashboard/PDFSelectionDialog";
import { chatWithGemini } from "../services/geminiService";
import type { UploadedFile } from "../types/types";

interface FloatingChatbotProps {
  uploadedFiles: UploadedFile[];
}

interface Message {
  text: string;
  sender: "user" | "bot";
}

export function FloatingChatbot({ uploadedFiles }: FloatingChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contextText, setContextText] = useState<string | null>(null);

  const handleSendMessage = async () => {
    if (!input.trim() || !contextText) return;

    const userMessage: Message = { text: input, sender: "user" };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");
    setIsSending(true);
    setError(null);

    try {
      const botResponse = await chatWithGemini(input, contextText);
      const botMessage: Message = { text: botResponse, sender: "bot" };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to get response";
      setError(errorMessage);
      console.error("Error sending message:", err);
      const errorMessageBot: Message = { text: errorMessage, sender: "bot" };
      setMessages((prevMessages) => [...prevMessages, errorMessageBot]);
    } finally {
      setIsSending(false);
    }
  };

  const handleSelectPdfs = async (selectedFiles: UploadedFile[]) => {
    if (selectedFiles.length === 0) {
      setError("Please select at least one PDF");
      return;
    }
    const combinedText = selectedFiles.map(f => f.text).join("\n\n");
    setContextText(combinedText);
    setIsDialogOpen(false);
    setMessages([]); // Clear messages when new context is loaded
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-[#DFF898] text-[#1C1C1E] p-4 rounded-full shadow-lg hover:bg-[#DFF898]/90 transition-all z-50"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: "spring", stiffness: 120, damping: 17 }}
            className="fixed bottom-24 right-6 w-80 h-[500px] bg-[#1C1C1E] border border-white/10 rounded-2xl shadow-xl flex flex-col z-50"
          >
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-lg text-white font-semibold">AI Chatbot</h3>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            <div className="flex-grow overflow-y-auto p-4 custom-scrollbar">
              {!contextText ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
                  <Bot className="w-10 h-10 mb-4 text-[#DFF898]" />
                  <p className="mb-4">Select PDFs to start chatting.</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsDialogOpen(true)}
                    className="bg-[#DFF898] text-[#1C1C1E] px-4 py-2 rounded-lg hover:bg-[#DFF898]/90 transition-all inline-flex items-center gap-2"
                  >
                    <Bot className="w-4 h-4" />
                    <span>Select PDFs</span>
                  </motion.button>
                </div>
              ) : (
                messages.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className={`flex items-start gap-3 mb-4 ${
                      msg.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {msg.sender === "bot" && (
                      <div className="w-7 h-7 rounded-full bg-[#DFF898]/20 flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-[#DFF898]" />
                      </div>
                    )}
                    <div
                      className={`max-w-[70%] p-3 rounded-lg ${
                        msg.sender === "user"
                          ? "bg-blue-600/70 text-white"
                          : "bg-gray-700/70 text-gray-100"
                      }`}
                    >
                      {msg.text}
                    </div>
                    {msg.sender === "user" && (
                      <div className="w-7 h-7 rounded-full bg-blue-600/30 flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-blue-300" />
                      </div>
                    )}
                  </motion.div>
                ))
              )}
              {isSending && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-start gap-3 mb-4"
                >
                  <div className="w-7 h-7 rounded-full bg-[#DFF898]/20 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-[#DFF898]" />
                  </div>
                  <div className="max-w-[70%] p-3 rounded-lg bg-gray-700/70 text-gray-100 animate-pulse">
                    Thinking...
                  </div>
                </motion.div>
              )}
               {error && contextText && ( // Display error message at the bottom if any
                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  <p className="text-sm text-red-300">{error}</p>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-white/10">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  className="flex-grow p-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#DFF898]"
                  placeholder={contextText ? "Ask a question..." : "Select PDFs to start chatting..."}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !isSending) {
                      handleSendMessage();
                    }
                  }}
                  disabled={isSending || !contextText}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSendMessage}
                  disabled={isSending || !input.trim() || !contextText}
                  className="bg-[#DFF898] text-[#1C1C1E] p-2 rounded-lg hover:bg-[#DFF898]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <PDFSelectionDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        uploadedFiles={uploadedFiles}
        onGenerate={handleSelectPdfs}
        title="Select PDFs for Chat Context"
      />
    </>
  );
}
