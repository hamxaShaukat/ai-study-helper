import React, { useState } from 'react';
import type { GeneratedContent, Flashcard as FlashcardType } from '../types/types';
import LoadingSpinner from './LoadingSpinner';
import Flashcard from './Flashcard';
import QuizView from './QuizView';
import { BookOpenIcon, LayersIcon, CheckCircleIcon, ArrowLeftIcon, ArrowRightIcon } from './icons';
import { House } from 'lucide-react';

interface ResultsViewProps {
  content: GeneratedContent;
  loadingStates: { summaries: boolean; flashcards: boolean; quiz: boolean; };
  onReset: () => void;
  onRegenerateQuiz: () => void;
}

type Tab = 'summary' | 'flashcards' | 'quiz';

const TabButton: React.FC<{
    label: string;
    icon: React.ReactNode;
    isActive: boolean;
    onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-3 px-6 py-4 text-base font-semibold border-b-2 transition-all duration-300 ${
            isActive
                ? 'border-black text-gray-900 bg-white shadow-sm'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
        }`}
    >
        {icon}
        {label}
    </button>
);

const FlashcardViewer: React.FC<{ cards: FlashcardType[] }> = ({ cards }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const goToPrevious = () => {
        setCurrentIndex(prev => (prev > 0 ? prev - 1 : prev));
    };

    const goToNext = () => {
        setCurrentIndex(prev => (prev < cards.length - 1 ? prev + 1 : prev));
    };
    
    if (!cards || cards.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <LayersIcon className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg">No flashcards were generated.</p>
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col items-center gap-8 animate-fade-in">
            <Flashcard key={currentIndex} card={cards[currentIndex]} />
            
            <div className="flex items-center gap-6">
                <div className="text-center">
                    <p className="text-gray-600 font-medium text-sm">
                        Card {currentIndex + 1} of {cards.length}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button
                    onClick={goToPrevious}
                    disabled={currentIndex === 0}
                    className="flex items-center gap-3 px-6 py-3 bg-white border border-gray-300 hover:border-gray-400 text-gray-700 font-medium rounded-xl transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                    aria-label="Previous card"
                >
                    <ArrowLeftIcon className="w-5 h-5"/>
                    <span>Previous</span>
                </button>
                <button
                    onClick={goToNext}
                    disabled={currentIndex === cards.length - 1}
                    className="flex items-center gap-3 px-6 py-3 bg-black hover:bg-gray-800 text-white font-medium rounded-xl transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                    aria-label="Next card"
                >
                    <span>Next</span>
                    <ArrowRightIcon className="w-5 h-5"/>
                </button>
            </div>
        </div>
    );
};

const ResultsView: React.FC<ResultsViewProps> = ({ content, loadingStates, onReset, onRegenerateQuiz }) => {
  const [activeTab, setActiveTab] = useState<Tab>('summary');

  const renderContent = () => {
    switch (activeTab) {
      case 'summary':
        return (
          loadingStates.summaries ? (
            <div className="flex justify-center items-center py-20">
              <LoadingSpinner size={12} />
            </div>
          ) : content.summaries && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <h3 className="text-xl font-bold text-gray-900">Brief Overview</h3>
                </div>
                <p className="text-gray-700 leading-relaxed text-lg">{content.summaries.short}</p>
              </div>
              
              <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <h3 className="text-xl font-bold text-gray-900">Detailed Summary</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">{content.summaries.medium}</p>
              </div>
              
              <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <h3 className="text-xl font-bold text-gray-900">Comprehensive Analysis</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">{content.summaries.long}</p>
              </div>
            </div>
          )
        );
      case 'flashcards':
        return (
          loadingStates.flashcards ? (
            <div className="flex justify-center items-center py-20">
              <LoadingSpinner size={12} />
            </div>
          ) : (
            <FlashcardViewer cards={content.flashcards || []} />
          )
        );
      case 'quiz':
        if (loadingStates.quiz && !content.quiz) {
            return (
              <div className="flex justify-center items-center py-20">
                <LoadingSpinner size={12} />
              </div>
            );
        }
        if (content.quiz) {
            return (
                <div className="animate-fade-in w-full">
                    <QuizView 
                        mcqs={content.quiz.mcqs} 
                        shortQuestions={content.quiz.short_questions}
                        onRegenerate={onRegenerateQuiz}
                        isRegenerating={loadingStates.quiz}
                    />
                </div>
            );
        }
        return null;
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 relative">
      {/* Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-10 right-10 w-40 h-40 bg-black/3 rounded-full blur-xl animate-float-slow"></div>
        <div className="absolute bottom-10 left-10 w-32 h-32 bg-black/5 rounded-full blur-lg animate-float-medium"></div>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Study Materials</h2>
          <p className="text-gray-600">AI-generated study aids from your document</p>
        </div>
        <button 
          onClick={onReset} 
          className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-6 rounded-xl transition-all duration-300 border border-gray-300 hover:border-gray-400 shadow-sm hover:shadow-md"
        >
          <House className="w-5 h-5" />
          New Document
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-8">
        <div className="flex border-b border-gray-200">
          <TabButton 
            label="Summary" 
            icon={<BookOpenIcon className="w-5 h-5"/>} 
            isActive={activeTab === 'summary'} 
            onClick={() => setActiveTab('summary')} 
          />
          <TabButton 
            label="Flashcards" 
            icon={<LayersIcon className="w-5 h-5"/>} 
            isActive={activeTab === 'flashcards'} 
            onClick={() => setActiveTab('flashcards')} 
          />
          <TabButton 
            label="Quiz" 
            icon={<CheckCircleIcon className="w-5 h-5"/>} 
            isActive={activeTab === 'quiz'} 
            onClick={() => setActiveTab('quiz')} 
          />
        </div>

        {/* Content Area */}
        <div className="p-8 min-h-[500px] flex justify-center items-start w-full bg-gray-50/50 rounded-b-2xl">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default ResultsView;