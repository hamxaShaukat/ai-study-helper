import { motion } from "motion/react";
import { Upload, Wand2, GraduationCap } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Upload",
    description: "Drop your PDF and watch the magic happen",
  },
  {
    icon: Wand2,
    title: "Process",
    description: "AI analyzes and creates study materials",
  },
  {
    icon: GraduationCap,
    title: "Master",
    description: "Study with personalized content",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-[#1C1C1E] relative overflow-hidden"
    >
      {/* Blob backgrounds */}
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-white/5 rounded-full blur-3xl"
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl lg:text-5xl text-white mb-4">
            Three Steps to Success
          </h2>
          <p className="text-xl text-gray-400">
            Simple, fast, effective
          </p>
        </motion.div>

        <div className="relative max-w-5xl mx-auto">
          {/* Curved connection line */}
          <svg
            className="absolute top-1/2 left-0 w-full h-2 -translate-y-1/2 hidden lg:block"
            viewBox="0 0 1000 100"
          >
            <motion.path
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 2, ease: "easeInOut" }}
              d="M 0 50 Q 250 20, 500 50 T 1000 50"
              stroke="white"
              strokeWidth="2"
              strokeDasharray="10,10"
              fill="none"
              opacity="0.2"
            />
          </svg>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.2,
                  }}
                  className="relative"
                >
                  <div className="flex flex-col items-center text-center relative z-10">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="relative mb-6"
                    >
                      {/* Number badge */}
                      <div className="absolute -top-4 -right-4 w-10 h-10 bg-[#DFF898] text-[#1C1C1E] rounded-full flex items-center justify-center z-20">
                        <span>{index + 1}</span>
                      </div>

                      {/* Icon container */}
                      <div className="w-24 h-24 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-2xl flex items-center justify-center relative overflow-hidden group">
                        <Icon className="w-10 h-10 text-white relative z-10" />

                        {/* Hover effect */}
                        <motion.div
                          className="absolute inset-0 bg-white/20"
                          initial={{ scale: 0, opacity: 0 }}
                          whileHover={{
                            scale: 1.5,
                            opacity: 1,
                          }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>

                      {/* Decorative doodles */}
                      <motion.svg
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 20,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="absolute -bottom-6 -left-6 w-12 h-12 text-white/10"
                        viewBox="0 0 50 50"
                      >
                        <circle
                          cx="25"
                          cy="25"
                          r="20"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1"
                          strokeDasharray="3,3"
                        />
                      </motion.svg>
                    </motion.div>

                    <h3 className="text-2xl text-white mb-3">
                      {step.title}
                    </h3>
                    <p className="text-gray-400 max-w-xs">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}