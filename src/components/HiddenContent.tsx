import { useState, useEffect, useRef, FC, KeyboardEvent } from 'react';
import type { FileSystemNode } from '../types';
import { fileSystem } from '../data/secretData';
import DecryptGame from './DecryptGame';

// ASCII Art Logo
const asciiLogo = `
  d888b  d8888b. d888888b  .d8b.  d8888b.  .d88b.  d8b   db
  88' Y8b 88  '8D   '88'   d8' '8b 88  '8D .8P  Y8. 888o  88
  88      88oobY'    88    88ooo88 88oobY' 88    88 88V8o 88
  88  ooo 88'8b      88    88~~~88 88'8b   88    88 88 V8o88
  88. ~8~ 88 '88.   .88.   88   88 88 '88. '8b  d8' 88  V888
   Y888P  88   YD Y888888P YP   YP 88   YD  'Y88P'  VP   V8P
`;

// 非同期処理で待機するためのヘルパー関数
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// マトリックスエフェクト
const MatrixEffect: FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext('2d')!;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
        const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const nums = '0123456789';
        const alphabet = katakana + latin + nums;

        const fontSize = 16;
        const columns = canvas.width / fontSize;
        const rainDrops: number[] = [];

        for (let x = 0; x < columns; x++) {
            rainDrops[x] = 1;
        }

        const draw = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#0F0';
            ctx.font = `${fontSize}px monospace`;

            for (let i = 0; i < rainDrops.length; i++) {
                const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
                ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);
                if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    rainDrops[i] = 0;
                }
                rainDrops[i]++;
            }
        };

        const interval = setInterval(draw, 30);
        return () => clearInterval(interval);
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 z-0" />;
};


interface HiddenContentProps {
    backToPortfolio: () => void;
}

const InteractiveTerminal: FC<HiddenContentProps> = ({ backToPortfolio }) => {
    const [history, setHistory] = useState<string[]>([]);
    const [input, setInput] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [mode, setMode] = useState<'normal' | 'password' | 'game'>('normal');
    const [unlockedFiles, setUnlockedFiles] = useState<string[]>([]);
    const [justUnlockedFile, setJustUnlockedFile] = useState<string | null>(null);
    const [activeFile, setActiveFile] = useState<string>('');
    const [passwordGuess, setPasswordGuess] = useState({ value: '', timestamp: 0 });
    const [gameGuess, setGameGuess] = useState({ value: '', timestamp: 0 });
    const [showMatrix, setShowMatrix] = useState(false);
    const terminalRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const bootSequenceCompleted = useRef(false);


    const addToHistory = (lines: string[]) => {
        setHistory(prev => [...prev, ...lines]);
    };

    // 起動時のシーケンス
    useEffect(() => {
        if (bootSequenceCompleted.current) return;
        bootSequenceCompleted.current = true;

        const bootSequence = async () => {
            setIsProcessing(true);
            setHistory([]);
            console.log(asciiLogo);
            console.log('Welcome to my secret terminal! Type `help` to get started.');

            await sleep(500);
            await typeLine("Welcome to my secret terminal.");
            await sleep(500);
            await typeLine("Type 'help' to see available commands.");
            addToHistory(['']);
            setIsProcessing(false);
        };
        bootSequence();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ターミナルに1行ずつテキストをタイプ表示する関数
    const typeLine = async (text: string, speed: number = 25) => {
        return new Promise<void>(resolve => {
            setHistory(prev => [...prev, '']);
            let line = '';
            let i = 0;
            const interval = setInterval(() => {
                line += text[i];
                setHistory(prev => {
                    const newHistory = [...prev];
                    newHistory[newHistory.length - 1] = line;
                    return newHistory;
                });
                i++;
                if (i >= text.length) {
                    clearInterval(interval);
                    resolve();
                }
            }, speed);
        });
    };

    // 履歴が更新されたら一番下にスクロールし、inputにフォーカス
    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
        if (!isProcessing) {
            inputRef.current?.focus();
        }
    }, [history, isProcessing]);

    // パスワードの正誤判定とファイルアンロック処理
    useEffect(() => {
        if (mode !== 'password' || passwordGuess.timestamp === 0) return;

        const node = getNodeByPath(activeFile, fileSystem);
        if (node?.type === 'file' && node.isProtected) {
            if (passwordGuess.value === node.password) {
                addToHistory(['Password correct. Access granted.']);
                setUnlockedFiles(prev => [...prev, activeFile]);
                setMode('normal');
                // ファイル内容を表示するために、別のuseEffectをトリガーします
                setJustUnlockedFile(activeFile);
            } else {
                addToHistory(['Incorrect password. Access denied.', '']);
                setMode('normal');
                setActiveFile(''); // アクティブファイルをリセット
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [passwordGuess]);

    // ファイルがアンロックされた直後にその内容を表示する
    useEffect(() => {
        if (justUnlockedFile) {
            handleCat(justUnlockedFile);
            setJustUnlockedFile(null); // トリガーをリセット
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [justUnlockedFile]);

    // クリックでinputにフォーカス
    const focusInput = () => {
        inputRef.current?.focus();
    };

    const getNodeByPath = (path: string, fs: FileSystemNode): FileSystemNode | undefined => {
        const parts = path.split('/').filter(p => p);
        let current: FileSystemNode | undefined = fs;
        for (const part of parts) {
            if (current?.type === 'directory' && current.children?.[part]) {
                current = current.children[part];
            } else {
                return undefined;
            }
        }
        return current;
    };


    // コマンド処理
    const handleCommand = async (command: string) => {
        const newHistory = [...history, `> ${command}`];
        setHistory(newHistory);
        setIsProcessing(true);

        const [cmd, ...args] = command.split(' ').filter(Boolean);

        await sleep(100);

        switch (cmd?.toLowerCase()) {
            case 'help':
                addToHistory([
                    "Available commands:",
                    "  <span class='text-yellow-300'>help</span>          - Show this help message",
                    "  <span class='text-yellow-300'>ls [path]</span>     - List files and directories",
                    "  <span class='text-yellow-300'>cat [file]</span>    - Display file content",
                    "  <span class='text-yellow-300'>decrypt [file]</span>- Attempt to decrypt a locked file",
                    "  <span class='text-yellow-300'>clear</span>         - Clear the terminal screen",
                    "  <span class='text-yellow-300'>exit</span>          - Return to the portfolio",
                    ""
                ]);
                break;

            case 'ls':
                handleLs(args[0]);
                break;

            case 'cat':
                handleCat(args[0]);
                break;

            case 'decrypt':
                handleDecrypt(args[0]);
                break;

            case 'clear':
                setHistory([]);
                break;

            case 'exit':
                addToHistory(["Returning to portfolio..."]);
                await sleep(1000);
                backToPortfolio();
                break;

            case undefined: // Empty input
                addToHistory(['']);
                break;

            default:
                addToHistory([`Command not found: ${command}`, '']);
                break;
        }
        setIsProcessing(false);
    };

    // `ls`コマンドの処理
    const handleLs = (path: string | undefined) => {
        const targetPath = path || '';
        const node = getNodeByPath(targetPath, fileSystem);

        if (node?.type === 'directory') {
            const items = Object.keys(node.children || {}).map(key => {
                const child = node.children![key];
                const isLocked = child.type === 'file' && child.isProtected && !unlockedFiles.includes(`${targetPath}/${key}`.replace(/^\//, ''));
                if (child.type === 'directory') {
                    return `<span class='text-blue-400'>${key}/</span>`;
                } else {
                    return isLocked ? `<span class='text-red-500'>[LOCKED] ${key}</span>` : key;
                }
            });
            addToHistory([items.join('   '), '']);
        } else if (node?.type === 'file') {
            addToHistory([path || '', '']);
        } else {
            addToHistory([`ls: cannot access '${path}': No such file or directory`, '']);
        }
    };

    // `cat`コマンドの処理
    const handleCat = (path: string | undefined) => {
        if (!path) {
            addToHistory(['cat: missing operand', '']);
            return;
        }

        const node = getNodeByPath(path, fileSystem);

        if (node?.type === 'file') {
            if (node.isProtected && !unlockedFiles.includes(path)) {
                setActiveFile(path);
                setMode('password');
                addToHistory([`Enter password for ${path}:`]);
                return;
            }
            const contentLines = node.content?.trim().split('\n') || [];
            addToHistory([...contentLines, '']);
        } else if (node?.type === 'directory') {
            addToHistory([`cat: ${path}: Is a directory`, '']);
        } else {
            addToHistory([`cat: ${path}: No such file or directory`, '']);
        }
    };

    const handleDecrypt = (path: string | undefined) => {
        if (!path) {
            addToHistory(['decrypt: missing file operand', '']);
            return;
        }
        const node = getNodeByPath(path, fileSystem);
        if (node?.type === 'file' && node.isProtected) {
            if (unlockedFiles.includes(path)) {
                addToHistory([`File ${path} is already unlocked.`, '']);
                return;
            }
            setActiveFile(path);
            setMode('game');
        } else if (node) {
            addToHistory([`decrypt: ${path}: File is not protected.`, '']);
        } else {
            addToHistory([`decrypt: ${path}: No such file or directory.`, '']);
        }
    };


    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !isProcessing) {
            const currentInput = input;
            setInput('');
            if (mode === 'normal') {
                handleCommand(currentInput);
            } else if (mode === 'password') {
                setPasswordGuess({ value: currentInput, timestamp: Date.now() });
                addToHistory([`> ********`]);
            } else if (mode === 'game') {
                setGameGuess({ value: currentInput, timestamp: Date.now() });
            }
        }
    };

    if (showMatrix) {
        return (
            <div className="relative w-screen h-screen">
                <MatrixEffect />
                <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="text-center text-white font-mono bg-black/50 p-8 rounded-lg">
                        <h2 className="text-4xl text-green-400 mb-4 animate-pulse">ACCESS GRANTED</h2>
                        <p className="text-xl">Welcome to the core.</p>
                        <button
                            onClick={() => {
                                setShowMatrix(false);
                                // マトリックス表示後にファイル内容を表示
                                addToHistory(["<span class='text-green-400'>DECRYPTION COMPLETE.</span> Displaying file contents..."]);
                                const node = getNodeByPath('unreleased_projects/Project_Zero.log', fileSystem);
                                if (node?.type === 'file' && node.content) {
                                    addToHistory([...node.content.trim().split('\n'), '']);
                                }
                            }}
                            className="mt-8 px-6 py-2 border border-green-400 text-green-400 hover:bg-green-400/20 transition-all"
                        >
                            Continue
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-black text-cyan-400 font-mono p-4 animate-fadeIn"
            onClick={focusInput}
        >
            <div className="w-full max-w-4xl h-[80vh] bg-black/50 border-2 border-cyan-500/30 rounded-lg shadow-2xl shadow-cyan-500/20 flex flex-col">
                <div className="bg-gray-900/80 p-2 flex items-center rounded-t-md border-b border-cyan-500/30">
                    <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    <p className="text-sm text-gray-400 ml-auto">root@portfolio:~/</p>
                </div>

                <div ref={terminalRef} className="flex-grow p-4 overflow-y-auto text-sm md:text-base">
                    {history.map((line, index) => (
                        <p key={index} className="m-0 whitespace-pre-wrap leading-relaxed" dangerouslySetInnerHTML={{ __html: line }} />
                    ))}
                    {!isProcessing && mode !== 'game' && (
                        <div className="flex">
                            <span className="mr-2">{mode === 'password' ? 'Enter password:' : '>'}</span>
                            <input
                                ref={inputRef}
                                type={mode === 'password' ? 'password' : 'text'}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="bg-transparent border-none outline-none text-cyan-400 font-mono flex-grow"
                                autoFocus
                                disabled={isProcessing}
                            />
                        </div>
                    )}
                    {mode === 'game' &&
                        <>
                            <div className="flex">
                                <span className="mr-2">&gt;</span>
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    className="bg-transparent border-none outline-none text-cyan-400 font-mono flex-grow"
                                    autoFocus
                                    disabled={isProcessing}
                                />
                            </div>
                            <DecryptGame
                                guess={gameGuess}
                                onUpdate={addToHistory}
                                onWin={() => {
                                    setUnlockedFiles(prev => [...prev, activeFile]);
                                    setMode('normal');
                                    setShowMatrix(true);
                                }}
                                onLose={() => {
                                    addToHistory(['DECRYPTION FAILED. Connection terminated.', '']);
                                    setMode('normal');
                                }}
                            />
                        </>
                    }
                </div>
            </div>
        </div>
    );
};

export default InteractiveTerminal;