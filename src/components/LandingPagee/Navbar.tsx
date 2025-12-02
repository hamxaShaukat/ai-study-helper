import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function Navbar() {
  const navigate = useNavigate();
  
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
      className="fixed top-0 left-0 right-0 z-50 bg-[#1C1C1E]/90 backdrop-blur-md border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="bg-[#DFF898] p-2 rounded-lg">
              <BookOpen className="w-6 h-6 text-[#1C1C1E]" />
            </div>
            <span className="text-xl text-white">StudyAI</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-400 hover:text-[#DFF898] transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-gray-400 hover:text-[#DFF898] transition-colors">
              How it works
            </a>
            <button 
              onClick={() => navigate("/auth")}
              className="bg-[#DFF898] text-[#1C1C1E] px-6 py-2 rounded-full hover:bg-[#DFF898]/90 transition-all"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}