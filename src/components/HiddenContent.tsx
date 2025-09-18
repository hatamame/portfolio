import { useState, useEffect, useRef, FC, KeyboardEvent } from 'react';
import { fileSystem } from '@/data/secretData';

// ASCII Art Logo
const asciiLogo = `
  d888b  d8888b. d888888b  .d8b.  d8888b.  .d88b.  d8b   db
  88' Y8b 88  '8D   '88'   d8' '8b 88  '8D .8P  Y8. 888o  88
  88      88oobY'    88    88ooo88 88oobY' 88    88 88V8o 88
  88  ooo 88'8b      88    88~~~88 88'8b   88    88 88 V8o88
  88. ~8~ 88 '88.   .88.   88   88 88 '88. '8b  d8' 88  V888
   Y888P  88   YD Y888888P YP   YP 88   YD  'Y88P'  VP   V8P
`;

// 型定義
type Directory = { [key: string]: string | Directory };

// 非同期処理で待機するためのヘルパー関数
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

interface HiddenContentProps {
    backToPortfolio: () => void;
}

const InteractiveTerminal: FC<HiddenContentProps> = ({ backToPortfolio }) => {
    const [history, setHistory] = useState<string[]>([]);
    const [input, setInput] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const terminalRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const bootSequenceCompleted = useRef(false);

    // 起動時のシーケンス
    useEffect(() => {
        if (bootSequenceCompleted.current) return;
        bootSequenceCompleted.current = true;

        const bootSequence = async () => {
            setIsProcessing(true);
            setHistory([]);

            // Display ASCII Art
            console.log(asciiLogo);
            console.log('Welcome to my secret terminal! Type `help` to get started.');


            await sleep(500);
            await typeLine("Welcome to my secret terminal.");
            await sleep(500);
            await typeLine("Type 'help' to see available commands.");
            setHistory(prev => [...prev, '']);
            setIsProcessing(false);
        };
        bootSequence();
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

    // クリックでinputにフォーカス
    const focusInput = () => {
        inputRef.current?.focus();
    };

    // コマンド処理
    const handleCommand = async () => {
        const command = input.trim();
        const newHistory = [...history.slice(0, -1), `> ${input}`];
        setHistory(newHistory);
        setInput('');
        setIsProcessing(true);

        const [cmd, ...args] = command.split(' ').filter(Boolean);

        await sleep(100);

        switch (cmd?.toLowerCase()) {
            case 'help':
                setHistory(prev => [
                    ...prev,
                    "Available commands:",
                    "  <span class='text-yellow-300'>help</span>          - Show this help message",
                    "  <span class='text-yellow-300'>ls [path]</span>     - List files and directories",
                    "  <span class='text-yellow-300'>cat [file]</span>    - Display file content",
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

            case 'clear':
                setHistory([]);
                break;

            case 'exit':
                setHistory(prev => [...prev, "Returning to portfolio..."]);
                await sleep(1000);
                backToPortfolio();
                break;

            case undefined: // Empty input
                setHistory(prev => [...prev, '']);
                break;

            default:
                setHistory(prev => [...prev, `Command not found: ${command}`, '']);
                break;
        }
        setIsProcessing(false);
    };

    // `ls`コマンドの処理
    const handleLs = (path: string | undefined) => {
        const parts = path ? path.split('/').filter(p => p) : [];
        let current: string | Directory = fileSystem;

        for (const part of parts) {
            if (typeof current === 'object' && current[part]) {
                current = current[part];
            } else {
                setHistory(prev => [...prev, `ls: cannot access '${path}': No such file or directory`, '']);
                return;
            }
        }

        if (typeof current === 'object') {
            const items = Object.keys(current).map(key => {
                const value = current[key];
                return typeof value === 'object' ? `<span class='text-blue-400'>${key}/</span>` : key;
            });
            setHistory(prev => [...prev, items.join('   '), '']);
        } else {
            setHistory(prev => [...prev, path || '', '']);
        }
    };

    // `cat`コマンドの処理
    const handleCat = (path: string | undefined) => {
        if (!path) {
            setHistory(prev => [...prev, 'cat: missing operand', '']);
            return;
        }
        const parts = path.split('/').filter(p => p);
        let current: string | Directory = fileSystem;
        let found = true;

        for (const part of parts) {
            if (typeof current === 'object' && current[part]) {
                current = current[part];
            } else {
                found = false;
                break;
            }
        }

        if (found && typeof current === 'string') {
            const contentLines = current.trim().split('\n');
            setHistory(prev => [...prev, ...contentLines, '']);
        } else if (found && typeof current === 'object') {
            setHistory(prev => [...prev, `cat: ${path}: Is a directory`, '']);
        } else {
            setHistory(prev => [...prev, `cat: ${path}: No such file or directory`, '']);
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !isProcessing) {
            handleCommand();
        }
    };

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
                    {!isProcessing && (
                        <div className="flex">
                            <span className="mr-2">{'>'}</span>
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
                    )}
                </div>
            </div>
        </div>
    );
};

export default InteractiveTerminal;
