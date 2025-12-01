import { motion } from "motion/react";
import { FileText, Layers, Brain, Zap } from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Smart Summaries",
    description: "AI analyzes your PDFs and creates concise, easy-to-understand summaries.",
  },
  {
    icon: Layers,
    title: "Instant Flashcards",
    description: "Generate flashcards automatically to help you memorize key concepts.",
  },
  {
    icon: Brain,
    title: "Custom Quizzes",
    description: "Test your knowledge with AI-generated quizzes tailored to your material.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Get your study materials ready in seconds, not hours.",
  }
];

export function Features() {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#1C1C1E] relative">
      {/* Doodle background */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="1" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-block mb-4"
          >
            <div className="text-6xl">⚡</div>
          </motion.div>
          
          <h2 className="text-4xl lg:text-5xl text-white mb-4">
            Supercharge Your Learning
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Everything you need to study smarter, all in one place
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="relative group"
              >
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-2xl h-full hover:bg-white/10 hover:border-white/20 transition-all">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="w-12 h-12 bg-[#DFF898] rounded-xl flex items-center justify-center mb-4"
                  >
                    <Icon className="w-6 h-6 text-[#1C1C1E]" />
                  </motion.div>
                  
                  <h3 className="text-xl text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400">
                    {feature.description}
                  </p>
                </div>

                {/* Doodle accents */}
                {index % 2 === 0 && (
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-3 -right-3 w-6 h-6 text-white/10"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 2 L12 22 M2 12 L22 12" />
                    </svg>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}