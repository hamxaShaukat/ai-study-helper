import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function CTA() {
  const navigate = useNavigate();
  
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#1C1C1E]">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden bg-white rounded-3xl p-12 md:p-16 text-center"
        >
          {/* Doodle decorations */}
          <motion.svg
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute top-8 right-8 w-16 h-16 text-black/10"
            viewBox="0 0 100 100"
          >
            <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M 50 10 L 50 90 M 10 50 L 90 50" stroke="currentColor" strokeWidth="2" />
            <circle cx="50" cy="50" r="15" fill="currentColor" opacity="0.3" />
          </motion.svg>

          <motion.svg
            animate={{ rotate: -360, scale: [1, 1.2, 1] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-8 left-8 w-20 h-20 text-black/10"
            viewBox="0 0 100 100"
          >
            <path d="M 20 50 Q 35 20, 50 50 T 80 50" fill="none" stroke="currentColor" strokeWidth="2" />
            <circle cx="20" cy="50" r="5" fill="currentColor" />
            <circle cx="50" cy="50" r="5" fill="currentColor" />
            <circle cx="80" cy="50" r="5" fill="currentColor" />
          </motion.svg>
          
          <div className="relative z-10">
            <motion.div
              animate={{ 
                y: [0, -10, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="inline-flex items-center gap-2 bg-black/5 px-4 py-2 rounded-full mb-6"
            >
              <Sparkles className="w-4 h-4 text-[#1C1C1E]" />
              <span className="text-sm text-black">Join 10,000+ Students</span>
            </motion.div>
            
            <h2 className="text-4xl lg:text-5xl text-black mb-4">
              Ready to Transform
              <br />
              Your Learning?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Start studying smarter today. No credit card required.
            </p>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/auth")}
              className="bg-[#1C1C1E] text-[#DFF898] px-8 py-4 rounded-full hover:bg-[#1C1C1E]/90 transition-all inline-flex items-center gap-2 group border-2 border-[#1C1C1E]"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
            
            <p className="text-gray-500 mt-6 text-sm">
              Free forever • No payment needed • Cancel anytime
            </p>
          </div>
        </motion.div>
      </div>
      
      <footer className="mt-20 text-center text-gray-600">
        <p>© 2025 StudyAI. Built for students who want more.</p>
      </footer>
    </section>
  );
}