import { useState, useEffect, FC, useRef } from 'react';

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
    const isMounted = useRef(true); // マウント状態を管理するref

    // ターミナルに1行ずつテキストをタイプ表示する関数
    const addLine = async (text: string, delay = 50) => {
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
    };

    // yが入力された後の成功シーケンス
    const runSuccessSequence = async () => {
        if (!isMounted.current) return;
        setIsPrompting(false);
        await addLine(`> PERMISSION GRANTED. EXECUTING 'sudo su'...`);

        let currentProgress = 0;
        while (currentProgress < 100) {
            if (!isMounted.current) return;
            const increment = Math.random() * 5 + 1;
            currentProgress = Math.min(100, currentProgress + increment);
            setProgress(currentProgress);

            // 特定のパーセンテージで意図的に停止させ、リアルな感じを出す
            if (currentProgress > 30 && currentProgress < 35) {
                await sleep(300);
            }
            if (currentProgress > 70 && currentProgress < 75) {
                await sleep(400);
            }

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
    };

    // nが入力された後のキャンセルシーケンス
    const runCancelSequence = async () => {
        if (!isMounted.current) return;
        setIsPrompting(false);
        await addLine(`> ACCESS DENIED. CLOSING CONNECTION...`);
        await sleep(1500);
        if (!isMounted.current) return;
        setIsExiting(true);
        setTimeout(() => {
            if (isMounted.current) onCancel();
        }, 500);
    };

    // 初期シーケンスの実行
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
                // 既にプロンプトが表示されている場合は追加しない
                if (prev[prev.length - 1]?.includes("GRANT ROOT PERMISSIONS")) {
                    return prev;
                }
                return [...prev, "GRANT ROOT PERMISSIONS? (Y/N)"];
            });
            setIsPrompting(true);
        };
        sequence();

        return () => {
            isMounted.current = false;
            sequenceCancelled = true;
        };
    }, []);

    // キー入力のハンドリング
    useEffect(() => {
        if (!isPrompting || isInputLocked) return;

        const handleKeyPress = async (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
                setIsInputLocked(true);
                // ユーザー入力を新しい行として追加する前に、最後の行がプロンプトか確認
                setLines(prev => {
                    const newLines = [...prev];
                    // 最後の行がプロンプトなら、その行をユーザー入力で置き換える
                    if (newLines[newLines.length - 1].includes('GRANT ROOT PERMISSIONS')) {
                        // This is tricky, because we want to remove the prompt line and add the user input line.
                        // Let's just add the user input on a new line.
                    }
                    return [...newLines, `> ${userInput}`];
                });

                const finalInput = userInput.toLowerCase();
                setUserInput('');

                await sleep(300);

                if (finalInput === 'y') {
                    runSuccessSequence();
                } else if (finalInput === 'n') {
                    runCancelSequence();
                } else {
                    await addLine(`> ERROR: Invalid command '${finalInput}'. Please enter Y or N.`);
                    await sleep(500);
                    // プロンプトを再表示
                    setLines(prev => [...prev, "GRANT ROOT PERMISSIONS? (Y/N)"]);
                    setIsInputLocked(false);
                }
            } else if (e.key === 'Backspace') {
                setUserInput(prev => prev.slice(0, -1));
            } else if (e.key.length === 1) { // 複数文字入力できるように修正
                setUserInput(prev => prev + e.key);
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [isPrompting, isInputLocked, userInput, onCancel, onFinished]);


    return (
        <div className={`fixed inset-0 bg-black flex flex-col items-center justify-center z-[100] text-cyan-400 font-mono transition-opacity duration-500 ${isExiting ? 'opacity-0' : 'opacity-100'}`}>
            <div className="w-[90vw] max-w-2xl h-auto text-left p-6 bg-black/50 backdrop-blur-sm border-2 border-cyan-500/30 rounded-lg shadow-2xl shadow-cyan-500/20">
                {lines.map((line, index) => (
                    <p key={index} className="m-0 text-sm md:text-base whitespace-pre-wrap">
                        {line}
                    </p>
                ))}
                {isPrompting && !isInputLocked && (
                    <p className="m-0 text-sm md:text-base">
                        {'> '}{userInput}
                        <span className="animate-pulse ml-1 bg-cyan-400 w-2 h-4 inline-block align-middle"></span>
                    </p>
                )}
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