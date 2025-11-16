
import React, { useState } from 'react';
import type { MCQ } from '../types/types';
import { RefreshCwIcon } from './icons';

interface MCQCardProps {
  mcq: MCQ;
  index: number;
}

const MCQCard: React.FC<MCQCardProps> = ({ mcq, index }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const handleOptionClick = (option: string) => {
    if (showAnswer) return;
    setSelectedOption(option);
  };
  
  const getOptionClass = (option: string) => {
      if (!showAnswer) {
          return selectedOption === option ? 'bg-sky-600' : 'bg-slate-700 hover:bg-slate-600';
      }
      if (option === mcq.answer) {
          return 'bg-green-600';
      }
      if (option === selectedOption && option !== mcq.answer) {
          return 'bg-red-600';
      }
      return 'bg-slate-700';
  };

  return (
    <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
      <p className="font-semibold text-slate-300">
        <span className="text-sky-400 mr-2">{index + 1}.</span>
        {mcq.question}
      </p>
      <div className="mt-4 space-y-3">
        {mcq.options.map((option, i) => (
          <button
            key={i}
            onClick={() => handleOptionClick(option)}
            className={`w-full text-left p-3 rounded-md transition-colors duration-200 ${getOptionClass(option)}`}
          >
            {option}
          </button>
        ))}
      </div>
      <div className="mt-4 text-right">
        <button 
          onClick={() => setShowAnswer(!showAnswer)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-sm font-medium transition-colors"
        >
          {showAnswer ? 'Hide' : 'Show'} Answer
        </button>
      </div>
    </div>
  );
};


interface QuizViewProps {
    mcqs: MCQ[];
    shortQuestions: string[];
    onRegenerate: () => void;
    isRegenerating: boolean;
}

const QuizView: React.FC<QuizViewProps> = ({ mcqs, shortQuestions, onRegenerate, isRegenerating }) => {
  return (
    <div className="space-y-12">
      <div>
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-sky-400">Multiple Choice Questions</h3>
            <button 
                onClick={onRegenerate}
                disabled={isRegenerating}
                className="flex items-center gap-2 px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isRegenerating ? (
                    <>
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Generating...</span>
                    </>
                ) : (
                    <>
                        <RefreshCwIcon className="w-5 h-5" />
                        <span>Generate Again</span>
                    </>
                )}
            </button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {mcqs.map((mcq, index) => (
            <MCQCard key={index} mcq={mcq} index={index} />
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-2xl font-bold text-sky-400 mb-6">Short Answer Questions</h3>
        <div className="space-y-4">
            {shortQuestions.map((question, index) => (
                <div key={index} className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                    <p className="text-slate-300">
                        <span className="text-sky-400 mr-2">{index + 1}.</span>
                        {question}
                    </p>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default QuizView;