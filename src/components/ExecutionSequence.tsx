import { FC, useState, useEffect, useCallback, useRef } from 'react';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

interface ExecutionSequenceProps {
    onFinished: () => void;
}

const ExecutionSequence: FC<ExecutionSequenceProps> = ({ onFinished }) => {
    const [lines, setLines] = useState<string[]>([]);
    const [isExiting, setIsExiting] = useState(false);
    const isMounted = useRef(true);

    const addLine = useCallback(async (text: string, delay = 25) => {
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

    useEffect(() => {
        isMounted.current = true;
        const sequence = async () => {
            await sleep(500);
            await addLine("> Bypassing security protocols...");
            await sleep(300);
            await addLine("> [OK] Firewall disabled.");
            await addLine("> [OK] Intrusion Detection System offline.");
            await sleep(500);
            await addLine("> Decompiling encrypted executables...");
            const symbols = ['▖', '▘', '▝', '▗', '▚', '▞', '龕', 'atele', '■'];
            for (let i = 0; i < 20; i++) {
                if (!isMounted.current) return;
                const progress = `> [${'#'.repeat(i)}${'.'.repeat(19 - i)}] ${symbols[i % symbols.length]} 0x${Math.random().toString(16).substr(2, 8).toUpperCase()}`;
                if (i > 0) {
                    setLines(prev => {
                        const newLines = [...prev];
                        newLines[newLines.length - 1] = progress;
                        return newLines;
                    });
                } else {
                    await addLine(progress, 1);
                }
                await sleep(100);
            }
            await sleep(300);
            await addLine("> [OK] Core logic decrypted.");
            await sleep(500);
            await addLine("> Injecting payload...");
            await sleep(800);
            await addLine("> Establishing connection to Deep Layer...");
            await sleep(1000);
            await addLine("> CONNECTION ESTABLISHED. LAUNCHING VISUALIZER...");
            await sleep(1500);

            if (isMounted.current) {
                setIsExiting(true);
                setTimeout(onFinished, 500);
            }
        };

        sequence();

        return () => {
            isMounted.current = false;
        };
    }, [addLine, onFinished]);


    return (
        <div className={`fixed inset-0 bg-black flex flex-col items-center justify-center z-[100] text-cyan-400 font-mono transition-opacity duration-500 ${isExiting ? 'opacity-0' : 'opacity-100'}`}>
            <div className="w-[90vw] max-w-2xl h-auto text-left p-6 bg-black/50 backdrop-blur-sm border-2 border-cyan-500/30 rounded-lg shadow-2xl shadow-cyan-500/20">
                {lines.map((line, index) => (
                    <p key={index} className="m-0 text-sm md:text-base whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: line.replace(/\[OK\]/g, "<span class='text-green-400'>[OK]</span>") }} />
                ))}
                {!isExiting && <span className="animate-pulse ml-1 bg-cyan-400 w-2 h-4 inline-block align-middle"></span>}
            </div>
            <p className="mt-6 text-sm text-gray-600">Executing...</p>
        </div>
    );
};

export default ExecutionSequence;