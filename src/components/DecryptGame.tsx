import { useState, useEffect, FC, useRef } from 'react';

interface DecryptGameProps {
    // ユーザーがEnterキーを押したときの推測を受け取るためのProp。
    // 同じ推測でもuseEffectがトリガーされるようにオブジェクトを使用します。
    guess: { value: string; timestamp: number };
    // メッセージ（指示、フィードバック）をターミナルに送り返すためのコールバック。
    onUpdate: (messages: string[]) => void;
    // ゲームに勝利したときのコールバック。
    onWin: (password: string) => void;
    // ゲームに敗北したときのコールバック。
    onLose: () => void;
}

const TARGET_PASSWORD = 'REBOOT';
const MAX_ATTEMPTS = 10;

const DecryptGame: FC<DecryptGameProps> = ({ guess, onUpdate, onWin, onLose }) => {
    const [attempts, setAttempts] = useState(0);
    const gameInitialized = useRef(false);

    // コンポーネントが最初にマウントされたときに、ゲームの初期メッセージを送信します。
    useEffect(() => {
        // StrictModeでの二重実行を防ぐためのチェック
        if (gameInitialized.current) return;
        gameInitialized.current = true;

        onUpdate([
            "--- DECRYPTION PROTOCOL INITIATED ---",
            `Target: Find the ${TARGET_PASSWORD.length}-character password.`,
            `Rules: Enter your guess. 'HITS' = correct character & position. 'BLOWS' = correct character, wrong position.`,
            `You have ${MAX_ATTEMPTS} attempts. Good luck.`,
        ]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // `guess` propが変更されるたびに推測を処理します。
    useEffect(() => {
        if (guess.timestamp === 0) return;

        const currentGuess = guess.value.toUpperCase();

        onUpdate([`Attempt #${attempts + 1}> ${currentGuess}`]);

        if (currentGuess.length !== TARGET_PASSWORD.length) {
            onUpdate([`Error: Guess must be ${TARGET_PASSWORD.length} characters long.`, '']);
            return;
        }

        const newAttempts = attempts + 1;
        setAttempts(newAttempts);

        if (currentGuess === TARGET_PASSWORD) {
            onWin(TARGET_PASSWORD);
            return;
        }

        let hits = 0;
        let blows = 0;
        const targetChars = TARGET_PASSWORD.split('');
        const guessChars = currentGuess.split('');

        // ヒットの計算：正しい文字が正しい位置にある。
        for (let i = 0; i < targetChars.length; i++) {
            if (targetChars[i] === guessChars[i]) {
                hits++;
                // ブローでの二重カウントを避けるために文字を使用済みとしてマークします。
                targetChars[i] = null!;
                guessChars[i] = null!;
            }
        }

        // ブローの計算：正しい文字が違う位置にある。
        for (let i = 0; i < targetChars.length; i++) {
            if (guessChars[i] !== null) {
                const index = targetChars.indexOf(guessChars[i]);
                if (index !== -1) {
                    blows++;
                    targetChars[index] = null!;
                }
            }
        }

        const feedback = `HITS: ${hits}, BLOWS: ${blows}`;

        if (newAttempts >= MAX_ATTEMPTS) {
            onUpdate([feedback]);
            onLose();
        } else {
            onUpdate([feedback, '']);
        }

    }, [guess]);

    return null;
};

export default DecryptGame;