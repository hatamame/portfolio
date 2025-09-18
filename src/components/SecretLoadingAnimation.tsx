import { useState, useEffect, FC, useRef, useCallback } from 'react';

// 非同期処理で待機するためのヘルパー関数
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

interface SecretLoadingAnimationProps {
    onFinished: () => void;
    onCancel: () => void;
}

const SecretLoadingAnimation: FC<SecretLoadingAnimationProps> = ({ onFinished, onCancel }) => {
    const [lines, setLines] = useState<string[]>([]);
    const [isPrompting, setIsPrompting] = useState(false);
    const [userInput, setUserInput] = useState('');
    const [isInputLocked, setIsInputLocked] = useState(false);
    const [isExiting, setIsExiting] = useState(false);
    const [progress, setProgress] = useState(0);
    const isMounted = useRef(true);

    const addLine = useCallback(async (text: string, delay = 50) => {
        if (!isMounted.current) return;
        let currentLine = '';
        setLines(prev => [...prev, '']);
        for (let i = 0; i < text.length; i++) {
            if (!isMounted.current) return;
            currentLine += text[i];
            setLines(prev => {
                const newLines = [...prev];
                newLines[newLines.length - 1] = currentLine;
                return newLines;
            });
            await sleep(delay);
        }
    }, []);

    const runSuccessSequence = useCallback(async () => {
        if (!isMounted.current) return;
        setIsPrompting(false);
        await addLine(`> PERMISSION GRANTED. EXECUTING 'sudo su'...`);

        let currentProgress = 0;
        while (currentProgress < 100) {
            if (!isMounted.current) return;
            const increment = Math.random() * 5 + 1;
            currentProgress = Math.min(100, currentProgress + increment);
            setProgress(currentProgress);

            if (currentProgress > 30 && currentProgress < 35) await sleep(300);
            if (currentProgress > 70 && currentProgress < 75) await sleep(400);

            await sleep(Math.random() * 100 + 50);
        }

        await sleep(500);
        if (!isMounted.current) return;
        await addLine(`> USER: GUEST -> ROOT`);
        await sleep(500);
        if (!isMounted.current) return;
        await addLine(`> ACCESS GRANTED. REDIRECTING...`);
        await sleep(1500);
        if (!isMounted.current) return;
        setIsExiting(true);
        setTimeout(() => {
            if (isMounted.current) onFinished();
        }, 500);
    }, [addLine, onFinished]);

    const runCancelSequence = useCallback(async () => {
        if (!isMounted.current) return;
        setIsPrompting(false);
        await addLine(`> ACCESS DENIED. CLOSING CONNECTION...`);
        await sleep(1500);
        if (!isMounted.current) return;
        setIsExiting(true);
        setTimeout(() => {
            if (isMounted.current) onCancel();
        }, 500);
    }, [addLine, onCancel]);

    useEffect(() => {
        isMounted.current = true;
        let sequenceCancelled = false;

        const sequence = async () => {
            await sleep(500);
            if (sequenceCancelled) return;
            await addLine("> ACCESSING SHIP'S MAIN COMPUTER...");
            if (sequenceCancelled) return;
            await sleep(1000);
            if (sequenceCancelled) return;
            await addLine("> CONNECTION ESTABLISHED.");
            if (sequenceCancelled) return;
            await sleep(500);
            if (sequenceCancelled) return;
            await addLine("> CURRENT USER: GUEST");
            if (sequenceCancelled) return;
            await sleep(1500);
            if (sequenceCancelled) return;
            await addLine("> ATTEMPTING TO ESCALATE PRIVILEGES...");
            if (sequenceCancelled) return;
            await sleep(1000);
            if (sequenceCancelled) return;
            await addLine("> WARNING: ROOT ACCESS REQUIRED. THIS ACTION IS LOGGED.", 30);
            if (sequenceCancelled) return;
            await sleep(500);
            if (sequenceCancelled) return;
            setLines(prev => {
                if (prev[prev.length - 1]?.includes("GRANT ROOT PERMISSIONS")) {
                    return prev;
                }
                return [...prev, "GRANT ROOT PERMISSIONS? (Y/N) "];
            });
            setIsPrompting(true);
        };
        sequence();

        return () => {
            isMounted.current = false;
            sequenceCancelled = true;
        };
    }, [addLine]);

    const userInputRef = useRef(userInput);
    userInputRef.current = userInput;

    const handleKeyPress = useCallback(async (e: KeyboardEvent) => {
        if (isInputLocked) return;

        if (e.key === 'Enter') {
            setIsInputLocked(true);
            const currentInput = userInputRef.current;

            setLines(prev => {
                const newLines = [...prev];
                const lastLineIndex = newLines.length - 1;
                if (newLines[lastLineIndex]?.includes('GRANT ROOT PERMISSIONS')) {
                    newLines[lastLineIndex] = `GRANT ROOT PERMISSIONS? (Y/N) > ${currentInput}`;
                }
                return newLines;
            });
            setUserInput('');

            await sleep(300);

            const finalInput = currentInput.toLowerCase();
            if (finalInput === 'y') {
                await runSuccessSequence();
            } else if (finalInput === 'n') {
                await runCancelSequence();
            } else {
                await addLine(`> ERROR: Invalid command '${finalInput}'. Please enter Y or N.`);
                await sleep(500);
                setLines(prev => [...prev, "GRANT ROOT PERMISSIONS? (Y/N) "]);
                setIsInputLocked(false);
            }
        } else if (e.key === 'Backspace') {
            setUserInput(prev => prev.slice(0, -1));
        } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
            setUserInput(prev => prev + e.key);
        }
    }, [isInputLocked, runSuccessSequence, runCancelSequence, addLine]);

    useEffect(() => {
        if (isPrompting) {
            window.addEventListener('keydown', handleKeyPress);
            return () => {
                window.removeEventListener('keydown', handleKeyPress);
            };
        }
    }, [isPrompting, handleKeyPress]);

    return (
        <div className={`fixed inset-0 bg-black flex flex-col items-center justify-center z-[100] text-cyan-400 font-mono transition-opacity duration-500 ${isExiting ? 'opacity-0' : 'opacity-100'}`}>
            <div className="w-[90vw] max-w-2xl h-auto text-left p-6 bg-black/50 backdrop-blur-sm border-2 border-cyan-500/30 rounded-lg shadow-2xl shadow-cyan-500/20">
                {lines.map((line, index) => (
                    <p key={index} className="m-0 text-sm md:text-base whitespace-pre-wrap">
                        {line}
                        {isPrompting && !isInputLocked && index === lines.length - 1 && line.includes('GRANT ROOT PERMISSIONS') && (
                            <>
                                {userInput}
                                <span className="animate-pulse ml-1 bg-cyan-400 w-2 h-4 inline-block align-middle"></span>
                            </>
                        )}
                    </p>
                ))}

                {progress > 0 && (
                    <div className="mt-4">
                        {progress < 100 && <p>{'>'} Escalating privileges...</p>}
                        <div className="relative w-full bg-gray-800/50 border border-cyan-500/20 rounded-full h-4 mt-2">
                            <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${progress}%`, transition: 'width 0.2s ease-out' }}></div>
                            <span className="absolute inset-0 flex items-center justify-center text-xs text-black font-bold">
                                {Math.floor(progress)}%
                            </span>
                        </div>
                    </div>
                )}
            </div>
            <p className="mt-6 text-sm text-gray-600">{isInputLocked ? "Processing..." : "Awaiting user input..."}</p>
        </div>
    );
};

export default SecretLoadingAnimation;