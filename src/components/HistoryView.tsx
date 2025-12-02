import React from 'react';
import type { HistoryItem } from '../types/types';
import { ArrowLeftIcon } from './icons';

interface HistoryViewProps {
  history: HistoryItem[];
  onBackToCurrentSession: () => void;
  onSelectHistoryItem: (item: HistoryItem) => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ history, onBackToCurrentSession, onSelectHistoryItem }) => {
  return (
    <div className="flex-1 flex flex-col p-6 overflow-y-auto custom-scrollbar">
      <button
        onClick={onBackToCurrentSession}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 self-start p-2 rounded-lg hover:bg-white/5"
      >
        <ArrowLeftIcon className="w-5 h-5" />
        Back to Current Session
      </button>

      <h2 className="text-2xl font-semibold text-white mb-6 p-2">Your Study History</h2>

      {history.length === 0 ? (
        <p className="text-gray-400 p-2">No saved history yet. Generate some content and save your progress!</p>
      ) : (
        <div className="grid gap-4 flex-1">
          {history.map((item, index) => (
            <div key={index} 
                 className="bg-white/5 rounded-xl border border-white/10 p-6 cursor-pointer hover:bg-white/10 transition-colors duration-200"
                 onClick={() => onSelectHistoryItem(item)}
            >
              <p className="text-sm text-gray-500 mb-2">Saved on: {item.timestamp ? (() => {
                try {
                  const date = typeof item.timestamp === 'object' && 'toDate' in item.timestamp ? (item.timestamp as any).toDate() : new Date(item.timestamp);
                  return date.toLocaleString();
                } catch (e) {
                  return 'Unknown date';
                }
              })() : 'Unknown'}</p>
              {item.content.summaries && (
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-white mb-2">Summaries</h3>
                  <p className="text-white">Short: {item.content.summaries.short}</p>
                  <p className="text-white">Medium: {item.content.summaries.medium}</p>
                  <p className="text-white">Long: {item.content.summaries.long}</p>
                </div>
              )}
              {item.content.flashcards && item.content.flashcards.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-white mb-2">Flashcards</h3>
                  <ul className="list-disc list-inside text-white">
                    {item.content.flashcards.map((card, cardIndex) => (
                      <li key={cardIndex}><strong>{card.front}</strong>: {card.back}</li>
                    ))}
                  </ul>
                </div>
              )}
              {item.content.quiz && (
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Quiz</h3>
                  {item.content.quiz.mcqs.length > 0 && (
                    <div className="mb-2">
                      <h4 className="font-medium text-white">Multiple Choice Questions:</h4>
                      <ul className="list-disc list-inside text-white">
                        {item.content.quiz.mcqs.map((mcq, mcqIndex) => (
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
                  {item.content.quiz.short_questions.length > 0 && (
                    <div>
                      <h4 className="font-medium text-white">Short Questions:</h4>
                      <ul className="list-disc list-inside text-white">
                        {item.content.quiz.short_questions.map((sq, sqIndex) => (
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
