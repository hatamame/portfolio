
import { useState, useEffect, FC } from 'react';

const LoadingAnimation: FC<{ onFinished: () => void }> = ({ onFinished }) => {
  const [typedText, setTypedText] = useState('');
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  const loadingSequence = [
    { text: 'SYSTEM CHECK INITIATED...', duration: 1500 },
    { text: 'CONNECTING TO MAIN SERVER...', duration: 1800 },
    { text: 'LOADING ASSETS & TEXTURES...', duration: 2200 },
    { text: 'STARTING ENGINE SEQUENCE...', duration: 2500 },
    { text: 'WELCOME ABOARD.', duration: 1000 },
  ];

  useEffect(() => {
    let sequenceTimeout: number;
    let exitTimeout: number;
    let progressInterval: number;

    const runSequence = (index: number) => {
      if (index >= loadingSequence.length) {
        setIsExiting(true);
        exitTimeout = window.setTimeout(onFinished, 1000); // Fade out duration
        return;
      }

      const current = loadingSequence[index];
      let i = 0;
      const typingInterval = setInterval(() => {
        setTypedText(current.text.substring(0, i + 1));
        i++;
        if (i > current.text.length) {
          clearInterval(typingInterval);
        }
      }, 50);

      sequenceTimeout = window.setTimeout(() => {
        runSequence(index + 1);
      }, current.duration);
    };

    runSequence(0);

    const totalDuration = loadingSequence.reduce((acc, curr) => acc + curr.duration, 0) + 500;
    const startTime = Date.now();
    progressInterval = window.setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const currentProgress = Math.min(100, (elapsedTime / totalDuration) * 100);
      setProgress(currentProgress);
      if (currentProgress >= 100) {
        clearInterval(progressInterval);
      }
    }, 50);

    return () => {
      clearTimeout(sequenceTimeout);
      clearTimeout(exitTimeout);
      clearInterval(progressInterval);
    };
  }, [onFinished]);

  return (
    <div className={`fixed inset-0 bg-black flex flex-col items-center justify-center z-[100] text-cyan-400 font-mono transition-opacity duration-1000 ${isExiting ? 'opacity-0' : 'opacity-100'}`}>
      <div className="w-48 h-48 mb-8 relative">
        <svg className={`w-full h-full transition-transform duration-1000 ease-in-out ${isExiting ? '-translate-y-[150vh] rotate-45' : 'animate-rocket-idle'}`} viewBox="0 0 200 200">
          <path d="M100 20 L140 100 L120 120 L120 180 L80 180 L80 120 L60 100 Z" fill="#e0e0e0" />
          <circle cx="100" cy="80" r="15" fill="#22d3ee" stroke="#333" strokeWidth="4" />
          <path d="M60 100 L40 140 L60 120 Z" fill="#c0c0c0" />
          <path d="M140 100 L160 140 L140 120 Z" fill="#c0c0c0" />
          <path d="M80 180 Q100 220 120 180 L100 170 Z" fill="#ffac33" className="animate-flame" />
        </svg>
      </div>
      <div className="w-80 h-auto text-left p-4 bg-black/30 backdrop-blur-sm border border-cyan-500/30 rounded-lg">
        <p className="text-lg text-white mb-2">{'>'} System Status:</p>
        <div className="h-6 mb-2">
          <span className="text-cyan-400">{typedText}</span>
          <span className="animate-pulse ml-1">_</span>
        </div>
        <div className="w-full bg-gray-800/50 border border-cyan-500/20 rounded-full h-2.5">
          <div className="bg-cyan-400 h-2 rounded-full" style={{ width: `${progress}%`, transition: 'width 0.1s linear' }}></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingAnimation;
