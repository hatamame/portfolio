import { useState, useEffect, FC } from 'react';

// 非同期処理で待機するためのヘルパー関数
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

interface BootingTextProps {
    text: string;
    startCondition?: boolean;
    className?: string;
    charDelay?: number; // 文字間のディレイ（ミリ秒）
    lineDelay?: number; // 行間のディレイ（ミリ秒）
}

const BootingText: FC<BootingTextProps> = ({
    text,
    startCondition = false,
    className = "",
    charDelay = 25, // タイプ速度
    lineDelay = 400 // 次の行に移るまでの待ち時間
}) => {
    const [lines, setLines] = useState<string[]>([]);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        // コンポーネントのアンマウントや再レンダリング時にアニメーションを中断するためのフラグ
        let isCancelled = false;

        const animateText = async () => {
            if (isCancelled) return;
            setIsAnimating(true);
            setLines([]);

            const allLines = text.split('\n').filter(line => line.trim() !== '');

            // 1行ずつアニメーションを実行
            for (let i = 0; i < allLines.length; i++) {
                if (isCancelled) return;
                // 表示する行の配列に空の文字列を追加して、タイピングを開始する準備
                setLines(prev => [...prev, '']);

                const currentLine = allLines[i];
                // 1文字ずつタイピング表示
                for (let j = 0; j < currentLine.length; j++) {
                    if (isCancelled) return;
                    setLines(prev => {
                        const newLines = [...prev];
                        newLines[i] = currentLine.substring(0, j + 1);
                        return newLines;
                    });
                    await sleep(charDelay);
                }

                // 次の行に移る前に待機
                if (i < allLines.length - 1) {
                    await sleep(lineDelay);
                }
            }
            setIsAnimating(false);
        };

        if (startCondition) {
            animateText();
        }

        // クリーンアップ関数
        return () => {
            isCancelled = true;
        };
    }, [text, startCondition, charDelay, lineDelay]);


    return (
        <div className={`${className}`}>
            {lines.map((line, index) => (
                <p key={index} className="m-0">
                    <span className="text-cyan-400 mr-2">{'>'}</span>
                    {line}
                    {/* アニメーション中の行の末尾にカーソルを表示 */}
                    {isAnimating && index === lines.length - 1 && (
                        <span className="animate-pulse ml-1 bg-cyan-400 w-2 h-4 inline-block align-middle"></span>
                    )}
                </p>
            ))}
            {/* 最初の行が表示される前、または行間で待機中にカーソルを表示 */}
            {isAnimating && lines.length === 0 && (
                <p className="m-0">
                    <span className="text-cyan-400 mr-2">{'>'}</span>
                    <span className="animate-pulse ml-1 bg-cyan-400 w-2 h-4 inline-block align-middle"></span>
                </p>
            )}
        </div>
    );
};

export default BootingText;