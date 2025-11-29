import React from 'react';
import type { GeneratedContent } from '../types/types';
import { ArrowLeftIcon } from './icons';

interface HistoryViewProps {
  history: GeneratedContent[];
  onBackToCurrentSession: () => void;
  onSelectHistoryItem: (item: GeneratedContent) => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ history, onBackToCurrentSession, onSelectHistoryItem }) => {
  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <button
        onClick={onBackToCurrentSession}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6"
      >
        <ArrowLeftIcon className="w-5 h-5" />
        Back to Current Session
      </button>
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Your Study History</h2>

      {history.length === 0 ? (
        <p className="text-gray-600">No saved history yet. Generate some content and save your progress!</p>
      ) : (
        <div className="grid gap-6">
          {history.map((item, index) => (
            <div key={index} 
                 className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-lg transition-shadow duration-200"
                 onClick={() => onSelectHistoryItem(item)}
            >
              <p className="text-sm text-gray-500 mb-2">Saved on: {new Date(item.timestamp.toDate()).toLocaleString()}</p>
              {item.summaries && (
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Summaries</h3>
                  <p className="text-gray-700">Short: {item.summaries.short}</p>
                  <p className="text-gray-700">Medium: {item.summaries.medium}</p>
                  <p className="text-gray-700">Long: {item.summaries.long}</p>
                </div>
              )}
              {item.flashcards && item.flashcards.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Flashcards</h3>
                  <ul className="list-disc list-inside text-gray-700">
                    {item.flashcards.map((card, cardIndex) => (
                      <li key={cardIndex}><strong>{card.front}</strong>: {card.back}</li>
                    ))}
                  </ul>
                </div>
              )}
              {item.quiz && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Quiz</h3>
                  {item.quiz.mcqs.length > 0 && (
                    <div className="mb-2">
                      <h4 className="font-medium text-gray-700">Multiple Choice Questions:</h4>
                      <ul className="list-disc list-inside text-gray-600">
                        {item.quiz.mcqs.map((mcq, mcqIndex) => (
                          <li key={mcqIndex}>
                            {mcq.question}
                            <ul className="list-inside list-circle ml-4">
                              {mcq.options.map((option, optionIndex) => (
                                <li key={optionIndex} className={option === mcq.answer ? 'font-semibold text-green-700' : ''}> {option}</li>
                              ))}
                            </ul>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {item.quiz.short_questions.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-700">Short Questions:</h4>
                      <ul className="list-disc list-inside text-gray-600">
                        {item.quiz.short_questions.map((sq, sqIndex) => (
                          <li key={sqIndex}>{sq}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryView;
