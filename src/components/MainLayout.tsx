import React from 'react';
import UserProfile from './UserProfile';
import AuthModal from './AuthModal';

interface MainLayoutProps {
  children: React.ReactNode;
  view: 'input' | 'results' | 'history';
  setView: (view: 'input' | 'results' | 'history') => void;
  error: string | null;
  setError: (error: string | null) => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, error, setError }) => {

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex flex-col font-sans relative overflow-hidden">
      {/* Enhanced Header */}
      <header className="w-full bg-white/90 backdrop-blur-xl border-b border-gray-100/80 shadow-sm z-50 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14v6l9-5m-9 5l-9-5" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  AI Study Helper
                </h1>
                <p className="text-xs text-gray-500 hidden sm:block">Transform PDFs into interactive study materials</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <UserProfile />
            </div>
          </div>
        </div>
      </header>
  
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Main gradient orbs */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-200/40 to-pink-200/30 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-blue-200/40 to-cyan-200/30 rounded-full blur-3xl animate-float-medium"></div>
        <div className="absolute top-1/3 left-1/4 w-60 h-60 bg-gradient-to-r from-emerald-200/30 to-teal-200/20 rounded-full blur-2xl animate-float-fast"></div>
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-gradient-to-l from-orange-200/20 to-amber-200/10 rounded-full blur-xl animate-float-slow"></div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>
      </div>
  
      {/* Main Content Area (children will be rendered here) */}
      <main className="w-full grow flex items-center justify-center p-4 sm:p-6 lg:p-8 relative z-10">
        <div className="w-full max-w-6xl mx-auto">
          {children}
        </div>
      </main>
      
      {/* Auth Modal */}
      <AuthModal />
      
      {/* Enhanced Error Notification */}
      {error && (
        <div className="fixed bottom-6 left-6 right-6 sm:right-auto sm:left-6 max-w-sm z-50 animate-slide-in-up">
          <div className="bg-white/95 backdrop-blur-xl text-gray-900 p-6 rounded-2xl shadow-2xl border border-red-200/50">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <h4 className="font-bold text-gray-900 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Attention Required
                </h4>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors text-xl font-light leading-none p-2 rounded-full hover:bg-gray-100/80"
              >
                &times;
              </button>
            </div>
            <pre className="whitespace-pre-wrap text-sm text-gray-700 font-medium bg-gray-50/50 p-3 rounded-lg border border-gray-200/50">
              {error}
            </pre>
          </div>
        </div>
      )}
      {/* Enhanced Footer */}
      <footer className="py-8 text-center relative z-10 bg-gradient-to-t from-white/80 to-transparent">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-2 text-gray-600">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <span className="text-sm font-medium">AI Powered Learning</span>
            </div>
            
            <p className="text-gray-500 text-sm font-medium">
              Transform PDFs into interactive study materials
            </p>
            
            <div className="flex items-center space-x-2 text-gray-400">
              <span className="text-xs">Built with</span>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-75"></div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse delay-150"></div>
              </div>
            </div>
          </div>
          
          {/* Feature badges */}
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            {['PDF Processing', 'AI Summaries', 'Smart Flashcards', 'Interactive Quizzes'].map((feature, index) => (
              <div
                key={feature}
                className="bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-full px-4 py-2 text-xs font-medium text-gray-600 shadow-sm hover:shadow-md transition-shadow"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {feature}
              </div>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
