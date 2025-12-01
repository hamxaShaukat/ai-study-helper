import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BookOpen, Mail, Lock, ArrowLeft, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(isLogin ? "Login" : "Sign up", { email, password, name });
  };

  const handleGoogleAuth = () => {
    console.log("Google auth");
  };

  return (
    <div className="min-h-screen bg-[#1C1C1E] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated blobs */}
      <motion.div
        animate={{ 
          scale: [1, 1.3, 1],
          x: [0, 100, 0],
          y: [0, -50, 0]
        }}
        transition={{ 
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl"
      />
      
      <motion.div
        animate={{ 
          scale: [1, 1.4, 1],
          x: [0, -80, 0],
          y: [0, 80, 0]
        }}
        transition={{ 
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3
        }}
        className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl"
      />

      {/* Doodle elements */}
      <motion.svg
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="absolute top-20 left-20 w-24 h-24 text-white/10"
        viewBox="0 0 100 100"
      >
        <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="5,5" />
        <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="1" />
        <circle cx="50" cy="50" r="10" fill="currentColor" opacity="0.3" />
      </motion.svg>

      <motion.svg
        animate={{ rotate: -360 }}
        transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-20 right-32 w-20 h-20 text-white/10"
        viewBox="0 0 100 100"
      >
        <path d="M 20 50 L 80 50 M 50 20 L 50 80" stroke="currentColor" strokeWidth="2" />
        <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3,3" />
      </motion.svg>

      {/* Back button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate("/")}
        className="absolute top-8 left-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span>Back</span>
      </motion.button>

      <div className="w-full max-w-md relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Logo & Header */}
          <div className="text-center mb-10">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="inline-flex items-center gap-3 mb-6"
            >
              <div className="bg-white p-3 rounded-2xl relative">
                <BookOpen className="w-8 h-8 text-black" />
                
                {/* Decorative doodle */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute -top-2 -right-2 w-6 h-6"
                >
                  <svg viewBox="0 0 24 24" className="text-white">
                    <circle cx="12" cy="12" r="10" fill="currentColor" />
                    <text x="12" y="16" textAnchor="middle" className="text-xs" fill="black">✨</text>
                  </svg>
                </motion.div>
              </div>
              <span className="text-2xl text-white">StudyAI</span>
            </motion.div>
            
            <h1 className="text-3xl text-white mb-3">
              {isLogin ? "Welcome Back" : "Get Started"}
            </h1>
            <p className="text-gray-400">
              {isLogin ? "Continue your learning journey" : "Join thousands of students"}
            </p>
          </div>

          {/* Auth Card */}
          <motion.div
            layout
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 relative overflow-hidden"
          >
            {/* Subtle background pattern */}
            <div className="absolute inset-0 opacity-5">
              <svg className="w-full h-full">
                <defs>
                  <pattern id="auth-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <circle cx="10" cy="10" r="1" fill="white" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#auth-grid)" />
              </svg>
            </div>

            <div className="relative z-10">
              {/* Google Auth Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGoogleAuth}
                type="button"
                className="w-full bg-white text-[#1C1C1E] py-4 rounded-xl hover:bg-gray-100 transition-all flex items-center justify-center gap-3 mb-6"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span>Continue with Google</span>
              </motion.button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-transparent text-gray-400">Or continue with email</span>
                </div>
              </div>

              {/* Toggle */}
              <div className="flex gap-2 mb-6 bg-white/5 p-1 rounded-xl border border-white/10">
                <button
                  onClick={() => setIsLogin(true)}
                  className={`flex-1 py-2.5 rounded-lg transition-all text-sm ${
                    isLogin
                      ? "bg-[#DFF898] text-[#1C1C1E]"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => setIsLogin(false)}
                  className={`flex-1 py-2.5 rounded-lg transition-all text-sm ${
                    !isLogin
                      ? "bg-[#DFF898] text-[#1C1C1E]"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Sign Up
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <AnimatePresence mode="wait">
                  {!isLogin && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Full Name"
                          className="w-full px-4 py-3.5 pl-12 bg-white/5 border border-white/10 rounded-xl focus:border-white/30 focus:outline-none transition-colors text-white placeholder:text-gray-500"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full px-4 py-3.5 pl-12 bg-white/5 border border-white/10 rounded-xl focus:border-white/30 focus:outline-none transition-colors text-white placeholder:text-gray-500"
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full px-4 py-3.5 pl-12 bg-white/5 border border-white/10 rounded-xl focus:border-white/30 focus:outline-none transition-colors text-white placeholder:text-gray-500"
                  />
                </div>

                {isLogin && (
                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 text-gray-400 cursor-pointer">
                      <input type="checkbox" className="rounded border-white/20 bg-white/5 text-[#DFF898] focus:ring-[#DFF898]" />
                      <span>Remember me</span>
                    </label>
                    <a href="#" className="text-[#DFF898] hover:text-[#DFF898]/80 transition-colors">
                      Forgot?
                    </a>
                  </div>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-[#DFF898] text-[#1C1C1E] py-4 rounded-xl hover:bg-[#DFF898]/90 transition-all"
                >
                  {isLogin ? "Sign In" : "Create Account"}
                </motion.button>
              </form>

              <p className="text-center text-sm text-gray-400 mt-6">
                {isLogin ? "New here? " : "Have an account? "}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-[#DFF898] hover:text-[#DFF898]/80 transition-colors underline"
                >
                  {isLogin ? "Create account" : "Sign in"}
                </button>
              </p>
            </div>
          </motion.div>

          <p className="text-center text-xs text-gray-500 mt-6">
            Protected by industry-standard encryption
          </p>
        </motion.div>
      </div>
    </div>
  );
}