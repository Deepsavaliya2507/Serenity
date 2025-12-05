import React, { useState, useEffect } from 'react';
import { Play, Pause, RefreshCw } from 'lucide-react';

const BreathingExercise: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [text, setText] = useState('Ready?');
  const [timeLeft, setTimeLeft] = useState(60); // 1 minute session

  // Timer Effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const isFinished = timeLeft === 0;

  // Breathing Text Effect
  useEffect(() => {
    let breathCycle: ReturnType<typeof setInterval>;
    let textTimeout: ReturnType<typeof setTimeout>;

    if (isActive) {
      const updateText = () => {
        setText('Breathe In...');
        textTimeout = setTimeout(() => {
           setText('Breathe Out...');
        }, 4000);
      };
      
      updateText(); // Immediate start
      breathCycle = setInterval(updateText, 8000);
    } else {
      if (isFinished) {
        setText('Session Complete');
      } else {
        setText('Ready?');
      }
    }

    return () => {
      if (breathCycle) clearInterval(breathCycle);
      if (textTimeout) clearTimeout(textTimeout);
    };
  }, [isActive, isFinished]);

  const toggleSession = () => {
    setIsActive(!isActive);
  };

  const resetSession = () => {
    setIsActive(false);
    setTimeLeft(60);
    setText('Ready?');
  };

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-160px)] animate-fade-in px-4">
      <div className="relative flex items-center justify-center w-64 h-64 mb-12">
        {/* Outer expanding rings */}
        <div className={`absolute w-full h-full rounded-full bg-serenity-100 mix-blend-multiply filter blur-xl opacity-70 ${isActive ? 'animate-breathe-in' : ''}`}></div>
        <div className={`absolute w-48 h-48 rounded-full bg-serenity-200 mix-blend-multiply filter blur-md opacity-70 ${isActive ? 'animate-breathe-in' : ''}`} style={{ animationDelay: '0.1s' }}></div>
        
        {/* Core circle */}
        <div className={`relative z-10 w-40 h-40 bg-white rounded-full shadow-lg flex items-center justify-center transition-transform duration-[4000ms] ease-in-out ${isActive ? 'scale-110' : 'scale-100'}`}>
           <span className="text-serenity-600 font-semibold text-lg text-center px-4 animate-fade-in">
             {text}
           </span>
        </div>
      </div>

      <div className="flex flex-col items-center space-y-6">
        <div className="text-4xl font-light text-gray-700 font-mono">
          00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
        </div>
        
        <div className="flex space-x-6">
          <button 
            onClick={resetSession}
            className="p-4 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
          >
            <RefreshCw size={24} />
          </button>
          
          <button 
            onClick={toggleSession}
            className={`p-6 rounded-full text-white shadow-lg transition-transform hover:scale-105 active:scale-95 ${
              isActive ? 'bg-orange-400 hover:bg-orange-500' : 'bg-serenity-500 hover:bg-serenity-600'
            }`}
          >
            {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
          </button>
        </div>
        
        <p className="text-sm text-gray-400 max-w-xs text-center mt-4">
          Follow the circle's rhythm. Inhale as it expands, exhale as it shrinks.
        </p>
      </div>
    </div>
  );
};

export default BreathingExercise;