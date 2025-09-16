
import { useState, useEffect, ReactNode } from 'react';

const GlitchText = ({ children, className = "" }: { children: ReactNode, className?: string }) => {
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 200);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`relative ${className}`}>
      <div className={`transition-all duration-200 ${glitch ? 'animate-pulse' : ''}`}>
        {children}
      </div>
      {glitch && (
        <>
          <div className="absolute top-0 left-0 text-red-500 opacity-70 transform translate-x-1" aria-hidden="true">
            {children}
          </div>
          <div className="absolute top-0 left-0 text-cyan-500 opacity-70 transform -translate-x-1" aria-hidden="true">
            {children}
          </div>
        </>
      )}
    </div>
  );
};

export default GlitchText;
