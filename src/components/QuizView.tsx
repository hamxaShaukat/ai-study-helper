import React, { useState } from 'react';
import type { MCQ } from '../types/types';
import { RefreshCwIcon } from './icons';
import { CircleCheckBig, Lightbulb } from 'lucide-react';

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
          return selectedOption === option 
            ? 'bg-black text-white border-black shadow-md' 
            : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:shadow-sm';
      }
      if (option === mcq.answer) {
          return 'bg-green-500 text-white border-green-500 shadow-md';
      }
      if (option === selectedOption && option !== mcq.answer) {
          return 'bg-red-500 text-white border-red-500 shadow-md';
      }
      return 'bg-white text-gray-700 border-gray-300';
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">
          {index + 1}
        </div>
        <p className="text-lg font-medium text-gray-900 leading-relaxed">
          {mcq.question}
        </p>
      </div>
      
      <div className="space-y-3">
        {mcq.options.map((option, i) => (
          <button
            key={i}
            onClick={() => handleOptionClick(option)}
            className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 font-medium ${getOptionClass(option)}`}
          >
            {option}
          </button>
        ))}
      </div>
      
      {showAnswer && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-blue-900">Explanation</span>
          </div>
          <p className="text-blue-800">answer</p>
        </div>
      )}
      
      <div className="mt-6 flex justify-between items-center">
        <button 
          onClick={() => setShowAnswer(!showAnswer)}
          className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors duration-200 border border-gray-300"
        >
          {showAnswer ? 'Hide Answer' : 'Reveal Answer'}
        </button>
        
        {selectedOption && !showAnswer && (
          <div className="text-sm text-gray-500">
            Selected: <span className="font-medium">{selectedOption}</span>
          </div>
        )}
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
      {/* Multiple Choice Section */}
      <div>
        <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Multiple Choice Questions</h3>
              <p className="text-gray-600">Test your knowledge with interactive questions</p>
            </div>
            <button 
                onClick={onRegenerate}
                disabled={isRegenerating}
                className="flex items-center gap-3 px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300 hover:border-gray-400 shadow-sm hover:shadow-md"
            >
                {isRegenerating ? (
                    <>
                        <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                        <span>Generating...</span>
                    </>
                ) : (
                    <>
                        <RefreshCwIcon className="w-5 h-5" />
                        <span>New Questions</span>
                    </>
                )}
            </button>
        </div>
        
        {mcqs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CircleCheckBig className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg">No questions generated yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mcqs.map((mcq, index) => (
              <MCQCard key={index} mcq={mcq} index={index} />
            ))}
          </div>
        )}
      </div>
      
      {/* Short Answer Section */}
      <div>
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Short Answer Questions</h3>
          <p className="text-gray-600">Practice explaining concepts in your own words</p>
        </div>
        
        {shortQuestions.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
            <p className="text-gray-500 text-lg">No short answer questions available.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {shortQuestions.map((question, index) => (
                <div key={index} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-gray-100 text-gray-700 rounded-full flex items-center justify-center text-sm font-bold shrink-0 mt-1">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900 font-medium mb-3">{question}</p>
                      <div className="h-20 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50/50 flex items-center justify-center">
                        <span className="text-gray-400">Write your answer here...</span>
                      </div>
                    </div>
                  </div>
                </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizView;