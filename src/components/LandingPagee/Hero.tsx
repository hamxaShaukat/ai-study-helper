import { motion } from "motion/react";
import { Upload, Sparkles, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function Hero() {
  const navigate = useNavigate();
  
  return (
    <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated blobs */}
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
        }}
        transition={{ 
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-20 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl"
      />
      
      <motion.div
        animate={{ 
          scale: [1, 1.3, 1],
          rotate: [0, -90, 0],
        }}
        transition={{ 
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
        className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl"
      />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full mb-6"
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span className="text-sm text-white">AI-Powered Study Assistant</span>
            </motion.div>
            
            <h1 className="text-6xl lg:text-7xl text-white mb-6">
              Learn
              <br />
              <span className="relative inline-block">
                Smarter
                <motion.svg
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, delay: 0.5 }}
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 300 20"
                >
                  <motion.path
                    d="M 10 10 Q 150 20 290 10"
                    stroke="#DFF898"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                  />
                </motion.svg>
              </span>
            </h1>
            
            <p className="text-xl text-gray-400 mb-8 max-w-lg mx-auto lg:mx-0">
              Transform your PDFs into personalized summaries, flashcards, and quizzes. Master any subject with AI.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/auth")}
                className="bg-[#DFF898] text-[#1C1C1E] px-8 py-4 rounded-full hover:bg-[#DFF898]/90 transition-all flex items-center justify-center gap-2 group"
              >
                <Upload className="w-5 h-5" />
                <span>Start Learning</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-white/20 text-white px-8 py-4 rounded-full hover:bg-white/10 transition-all"
              >
                Watch Demo
              </motion.button>
            </div>

            {/* Stats */}
            <div className="mt-12 flex gap-8 justify-center lg:justify-start">
              <div>
                <div className="text-3xl text-white">10k+</div>
                <div className="text-sm text-gray-400">Students</div>
              </div>
              <div>
                <div className="text-3xl text-white">50k+</div>
                <div className="text-sm text-gray-400">PDFs Analyzed</div>
              </div>
              <div>
                <div className="text-3xl text-white">95%</div>
                <div className="text-sm text-gray-400">Success Rate</div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Main card */}
            <motion.div
              animate={{ 
                y: [0, -20, 0],
              }}
              transition={{ 
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative z-10 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8"
            >
              {/* Doodles */}
              <motion.svg
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute -top-6 -right-6 w-20 h-20 text-white/20"
                viewBox="0 0 100 100"
              >
                <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5,5" />
                <circle cx="50" cy="50" r="5" fill="currentColor" />
              </motion.svg>

              <motion.svg
                initial={{ rotate: 0 }}
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute -bottom-4 -left-4 w-16 h-16 text-white/20"
                viewBox="0 0 100 100"
              >
                <path d="M 10 50 L 90 50 M 50 10 L 50 90" stroke="currentColor" strokeWidth="2" />
                <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="2" />
              </motion.svg>
              
              <div className="flex items-center justify-between mb-6">
                <div className="text-white">Document Analysis</div>
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-white/20"></div>
                  <div className="w-3 h-3 rounded-full bg-white/20"></div>
                  <div className="w-3 h-3 rounded-full bg-white/40"></div>
                </div>
              </div>
              
              <div className="space-y-4 mb-6">
                {[60, 80, 40].map((width, i) => (
                  <motion.div
                    key={i}
                    initial={{ width: 0 }}
                    animate={{ width: `${width}%` }}
                    transition={{ duration: 1, delay: 0.5 + i * 0.2 }}
                    className="h-3 bg-white/20 rounded-full"
                  />
                ))}
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                {["Summary", "Flashcards", "Quiz"].map((label, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1 + i * 0.1 }}
                    className="bg-white/10 backdrop-blur-sm border border-white/20 p-4 rounded-xl text-center"
                  >
                    <div className="w-8 h-8 bg-white/20 rounded-lg mx-auto mb-2"></div>
                    <div className="text-xs text-white/80">{label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Floating elements */}
            <motion.div
              animate={{ 
                y: [0, -30, 0],
                rotate: [0, 10, 0]
              }}
              transition={{ 
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
              className="absolute -top-8 -left-8 bg-white/10 backdrop-blur-sm border border-white/20 p-4 rounded-2xl"
            >
              <div className="text-white text-2xl">✨</div>
            </motion.div>

            <motion.div
              animate={{ 
                y: [0, 20, 0],
                rotate: [0, -10, 0]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
              className="absolute -bottom-4 -right-4 bg-white/10 backdrop-blur-sm border border-white/20 p-4 rounded-2xl"
            >
              <div className="text-white text-2xl">🎯</div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}