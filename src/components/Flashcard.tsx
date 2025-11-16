import React, { useState, useEffect } from 'react';
import type { Flashcard as FlashcardType } from '../types/types';
import { RefreshCwIcon } from './icons';
import { Lightbulb } from 'lucide-react';

interface FlashcardProps {
  card: FlashcardType;
}

const Flashcard: React.FC<FlashcardProps> = ({ card }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsFlipped(false);
  }, [card]);

  const handleFlip = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIsFlipped(!isFlipped);
    setTimeout(() => setIsAnimating(false), 700);
  };

  return (
    <div 
      className="w-full max-w-2xl h-96 perspective-[1000px] cursor-pointer group"
      onClick={handleFlip}
    >
      <div
        className={`relative w-full h-full transition-transform duration-700 ease-in-out rounded-3xl shadow-2xl ${
          isFlipped ? 'transform-[rotateY(180deg)]' : ''
        } transform-3d`}
      >
        {/* Front Side */}
        <div className="absolute w-full h-full backface-hidden bg-white rounded-3xl p-8 flex flex-col justify-center items-center text-center border-2 border-gray-200 shadow-lg">
          <div className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full border border-blue-200">
            <Lightbulb className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-700">QUESTION</span>
          </div>
          
          <div className="flex-1 flex items-center justify-center w-full">
            <p className="text-2xl font-semibold text-gray-900 leading-relaxed px-4">
              {card.front}
            </p>
          </div>
          
          <div className="absolute bottom-6 right-6 flex items-center gap-2 text-gray-500 group-hover:text-gray-700 transition-colors">
            <RefreshCwIcon className="w-4 h-4" />
            <span className="text-sm font-medium">Click to flip</span>
          </div>
        </div>

        {/* Back Side */}
        <div className="absolute w-full h-full backface-hidden transform-[rotateY(180deg)] bg-gray-900 rounded-3xl p-8 flex flex-col justify-center items-center text-center border-2 border-gray-700 shadow-2xl">
          <div className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 bg-green-500/20 rounded-full border border-green-500/30">
            <span className="text-sm font-semibold text-green-400">ANSWER</span>
          </div>
          
          <div className="flex-1 flex items-center justify-center w-full">
            <p className="text-xl font-medium text-white leading-relaxed px-4">
              {card.back}
            </p>
          </div>
          
          <div className="absolute bottom-6 right-6 flex items-center gap-2 text-gray-400 group-hover:text-gray-300 transition-colors">
            <RefreshCwIcon className="w-4 h-4" />
            <span className="text-sm font-medium">Click to flip back</span>
          </div>
        </div>
      </div>

      {/* Flip Indicator */}
      <div className="text-center mt-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
          <div className={`w-2 h-2 rounded-full transition-colors ${
            !isFlipped ? 'bg-blue-500' : 'bg-gray-400'
          }`}></div>
          <div className={`w-2 h-2 rounded-full transition-colors ${
            isFlipped ? 'bg-green-500' : 'bg-gray-400'
          }`}></div>
          <span className="text-sm text-gray-600 font-medium">
            {isFlipped ? 'Viewing Answer' : 'Viewing Question'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;