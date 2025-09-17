import { useState, useEffect, FC, useRef, useMemo } from 'react';

interface BootingTextProps {
    text: string;
    startCondition?: boolean;
    className?: string;
}

const BootingText: FC<BootingTextProps> = ({ text, startCondition, className = "" }) => {
    const [linesToShow, setLinesToShow] = useState<string[]>([]);
    const hasAnimatedRef = useRef(false);

    // useMemo to prevent re-calculating on every render
    const allLines = useMemo(() =>
        text.split('。').filter(line => line).map((line, index, arr) => index < arr.length - 1 ? line + '。' : line),
        [text]
    );

    useEffect(() => {
        // Start animation only if it's visible and has not run before
        if (startCondition && !hasAnimatedRef.current) {
            hasAnimatedRef.current = true; // Mark as animated to prevent re-runs

            let lineIndex = 0;
            const lineInterval = setInterval(() => {
                if (lineIndex < allLines.length) {
                    setLinesToShow(prev => [...prev, allLines[lineIndex]]);
                    lineIndex++;
                } else {
                    clearInterval(lineInterval);
                }
            }, 300);

            return () => clearInterval(lineInterval);
        }
    }, [startCondition, text, allLines]);

    const isAnimating = startCondition && linesToShow.length < allLines.length;

    return (
        <div className={`${className}`}>
            {linesToShow.map((line, index) => (
                <p key={index} className="m-0">
                    <span className="text-cyan-400 mr-2">{'>'}</span>{line}
                </p>
            ))}
            {/* Show cursor only while booting */}
            {isAnimating && (
                <span className="animate-pulse ml-2 bg-cyan-400 w-2 h-4 inline-block align-middle"></span>
            )}
        </div>
    );
};

export default BootingText;