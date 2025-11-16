import React, { useState } from 'react';
import type { GeneratedContent, Flashcard as FlashcardType } from '../types/types';
import LoadingSpinner from './LoadingSpinner';
import Flashcard from './Flashcard';
import QuizView from './QuizView';
import { BookOpenIcon, LayersIcon, CheckCircleIcon, ArrowLeftIcon, ArrowRightIcon } from './icons';

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
        className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold rounded-t-lg border-b-2 transition-all ${
            isActive
                ? 'border-sky-400 text-sky-300 bg-slate-800'
                : 'border-transparent text-slate-400 hover:text-sky-300'
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
        return <p className="text-slate-400">No flashcards were generated.</p>;
    }

    return (
        <div className="w-full flex flex-col items-center gap-6 animate-fade-in">
            <Flashcard key={currentIndex} card={cards[currentIndex]} />
            <div className="text-center">
                <p className="text-slate-300 font-medium">
                    Card {currentIndex + 1} of {cards.length}
                </p>
            </div>
            <div className="flex items-center gap-4">
                <button
                    onClick={goToPrevious}
                    disabled={currentIndex === 0}
                    className="flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Previous card"
                >
                    <ArrowLeftIcon className="w-5 h-5"/>
                    <span>Previous</span>
                </button>
                <button
                    onClick={goToNext}
                    disabled={currentIndex === cards.length - 1}
                    className="flex items-center gap-2 px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
          loadingStates.summaries ? <LoadingSpinner size={12} /> : content.summaries && (
            <div className="space-y-8 animate-fade-in">
              <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
                <h3 className="text-xl font-bold text-sky-400">Short Summary</h3>
                <p className="mt-2 text-slate-300">{content.summaries.short}</p>
              </div>
              <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
                <h3 className="text-xl font-bold text-sky-400">Medium Summary</h3>
                <p className="mt-2 text-slate-300">{content.summaries.medium}</p>
              </div>
              <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
                <h3 className="text-xl font-bold text-sky-400">Long Summary</h3>
                <p className="mt-2 text-slate-300">{content.summaries.long}</p>
              </div>
            </div>
          )
        );
      case 'flashcards':
        return (
          loadingStates.flashcards ? <LoadingSpinner size={12} /> : (
            <FlashcardViewer cards={content.flashcards || []} />
          )
        );
      case 'quiz':
        if (loadingStates.quiz && !content.quiz) {
            return <LoadingSpinner size={12} />; // Only show spinner on initial load
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
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-white">Your Study Aids</h2>
        <button onClick={onReset} className="bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
            Start Over
        </button>
      </div>

      <div className="border-b border-slate-700 flex">
        <TabButton label="Summary" icon={<BookOpenIcon className="w-5 h-5"/>} isActive={activeTab === 'summary'} onClick={() => setActiveTab('summary')} />
        <TabButton label="Flashcards" icon={<LayersIcon className="w-5 h-5"/>} isActive={activeTab === 'flashcards'} onClick={() => setActiveTab('flashcards')} />
        <TabButton label="Quiz" icon={<CheckCircleIcon className="w-5 h-5"/>} isActive={activeTab === 'quiz'} onClick={() => setActiveTab('quiz')} />
      </div>

      <div className="mt-8 min-h-[400px] flex justify-center items-start w-full">
        {renderContent()}
      </div>
    </div>
  );
};

export default ResultsView;