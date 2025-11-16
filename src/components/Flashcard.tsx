import React, { useState, useEffect } from 'react';
import type { Flashcard as FlashcardType } from '../types/types';
import { RefreshCwIcon } from './icons';

interface FlashcardProps {
  card: FlashcardType;
}

const Flashcard: React.FC<FlashcardProps> = ({ card }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  // When the card prop changes (i.e., we navigate to a new card), reset the flip state
  useEffect(() => {
    setIsFlipped(false);
  }, [card]);

  return (
    <div 
      className="w-full max-w-xl h-80 [perspective:1000px] cursor-pointer"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className={`relative w-full h-full transition-all duration-700 ease-in-out rounded-2xl shadow-2xl ${
          isFlipped ? '[transform:rotateY(180deg)]' : ''
        } [transform-style:preserve-3d]`}
      >
        {/* Front */}
        <div className="absolute w-full h-full [backface-visibility:hidden] bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl p-8 flex flex-col justify-center items-center text-center cursor-pointer border border-slate-600">
            <div className="absolute top-4 left-4 text-sm font-bold text-sky-400 bg-slate-900/50 px-3 py-1 rounded-full">
              QUESTION
            </div>
            <p className="text-2xl font-semibold text-slate-100">{card.front}</p>
            <div className="absolute bottom-4 right-4 text-slate-500 flex items-center gap-2 text-sm">
                <RefreshCwIcon className="w-4 h-4" />
                <span>Click to flip</span>
            </div>
        </div>

        {/* Back */}
        <div className="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 flex flex-col justify-center items-center text-center cursor-pointer border border-green-500/50">
           <div className="absolute top-4 left-4 text-sm font-bold text-green-400 bg-slate-900/50 px-3 py-1 rounded-full">
             ANSWER
           </div>
           <p className="text-xl text-slate-200">{card.back}</p>
           <div className="absolute bottom-4 right-4 text-slate-500 flex items-center gap-2 text-sm">
                <RefreshCwIcon className="w-4 h-4" />
                <span>Click to flip</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;