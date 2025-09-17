import { useRef, useEffect, useState } from 'react';
import { Gamepad2 } from 'lucide-react';

// Particle interface for explosions
interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    alpha: number;
    color: string;
}

// Brick properties including health and color
interface Brick {
    x: number;
    y: number;
    status: number;
    health: number;
    color: string;
}

const Game = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [gameState, setGameState] = useState<'waiting' | 'playing' | 'gameOver' | 'cleared'>('waiting');
    const [score, setScore] = useState(0);
    const gameLoopRef = useRef<number | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        if (gameLoopRef.current) {
            cancelAnimationFrame(gameLoopRef.current);
        }

        // --- Game Variables ---
        let rightPressed = false;
        let leftPressed = false;

        const ballRadius = 8;
        let x = canvas.width / 2;
        let y = canvas.height - 30;
        let ballSpeed = 5;
        let dx = 0;
        let dy = 0;

        const paddleHeight = 12;
        const paddleWidth = 120;
        let paddleX = (canvas.width - paddleWidth) / 2;

        const brickRowCount = 6;
        const brickColumnCount = 9;
        const brickWidth = 65;
        const brickHeight = 20;
        const brickPadding = 10;
        const brickOffsetTop = 50;
        const brickOffsetLeft = 35;

        let bricks: Brick[][] = [];

        let shakeIntensity = 0;
        let shakeDuration = 0;
        let particles: Particle[] = [];

        // --- Game Initialization ---
        const initGame = () => {
            setScore(0);
            x = canvas.width / 2;
            y = canvas.height - 50;
            paddleX = (canvas.width - paddleWidth) / 2;
            const angle = -Math.PI / 4 + (Math.random() * -Math.PI / 2);
            dx = ballSpeed * Math.cos(angle);
            dy = -ballSpeed * Math.sin(angle);

            bricks = [];
            for (let c = 0; c < brickColumnCount; c++) {
                bricks[c] = [];
                for (let r = 0; r < brickRowCount; r++) {
                    const health = r < 2 ? 2 : 1; // Top two rows are stronger
                    bricks[c][r] = {
                        x: 0,
                        y: 0,
                        status: 1,
                        health: health,
                        color: health > 1 ? "#ff007f" : "#00f5ff"
                    };
                }
            }
        }

        if (gameState === 'playing' && score === 0) {
            initGame();
        }

        // --- Event Handlers ---
        const keyDownHandler = (e: KeyboardEvent) => {
            if (e.key === "Right" || e.key === "ArrowRight") rightPressed = true;
            else if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = true;
        };
        const keyUpHandler = (e: KeyboardEvent) => {
            if (e.key === "Right" || e.key === "ArrowRight") rightPressed = false;
            else if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = false;
        };
        document.addEventListener("keydown", keyDownHandler);
        document.addEventListener("keyup", keyUpHandler);

        // --- Utility Functions ---
        const createParticles = (brick: Brick) => {
            for (let i = 0; i < 15; i++) {
                particles.push({
                    x: brick.x + brickWidth / 2,
                    y: brick.y + brickHeight / 2,
                    vx: (Math.random() - 0.5) * 4,
                    vy: (Math.random() - 0.5) * 4,
                    alpha: 1,
                    color: brick.color,
                });
            }
        };

        const triggerScreenShake = (intensity: number, duration: number) => {
            shakeIntensity = intensity;
            shakeDuration = duration;
        }

        // --- Collision Detection ---
        const collisionDetection = () => {
            let allBricksDestroyed = true;
            for (let c = 0; c < brickColumnCount; c++) {
                for (let r = 0; r < brickRowCount; r++) {
                    const b = bricks[c][r];
                    if (b.status === 1) {
                        allBricksDestroyed = false;
                        if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                            dy = -dy;
                            b.health--;
                            triggerScreenShake(5, 10);
                            if (b.health <= 0) {
                                b.status = 0;
                                createParticles(b);
                                setScore(s => s + (r < 2 ? 20 : 10)); // More points for stronger bricks
                            } else {
                                b.color = "#f7ff00";
                                setScore(s => s + 5);
                            }
                        }
                    }
                }
            }
            if (allBricksDestroyed && bricks.length > 0) {
                setGameState('cleared');
            }
        };

        // --- Drawing Functions ---
        const drawBall = () => {
            ctx.shadowColor = '#22d3ee';
            ctx.shadowBlur = 20;
            ctx.beginPath();
            ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
            ctx.fillStyle = "#fff";
            ctx.fill();
            ctx.closePath();
            ctx.shadowBlur = 0;
        };

        const drawPaddle = () => {
            ctx.shadowColor = '#06b6d4';
            ctx.shadowBlur = 15;
            ctx.beginPath();
            ctx.rect(paddleX, canvas.height - paddleHeight - 5, paddleWidth, paddleHeight);
            ctx.fillStyle = "#06b6d4";
            ctx.fill();
            ctx.closePath();
            ctx.shadowBlur = 0;
        };

        const drawBricks = () => {
            for (let c = 0; c < brickColumnCount; c++) {
                for (let r = 0; r < brickRowCount; r++) {
                    if (bricks[c][r] && bricks[c][r].status === 1) {
                        const b = bricks[c][r];
                        const brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                        const brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                        b.x = brickX;
                        b.y = brickY;
                        ctx.beginPath();
                        ctx.rect(brickX, brickY, brickWidth, brickHeight);
                        ctx.fillStyle = b.color;
                        ctx.shadowColor = b.color;
                        ctx.shadowBlur = 10;
                        ctx.fill();
                        ctx.closePath();
                        ctx.shadowBlur = 0;
                    }
                }
            }
        };

        const drawParticles = () => {
            particles.forEach((p, index) => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = p.alpha;
                ctx.fill();
                ctx.closePath();
                p.x += p.vx;
                p.y += p.vy;
                p.alpha -= 0.02;
                if (p.alpha <= 0) {
                    particles.splice(index, 1);
                }
            });
            ctx.globalAlpha = 1;
        };

        // --- Main Game Loop ---
        const draw = () => {
            if (gameState !== 'playing') {
                if (gameLoopRef.current) {
                    cancelAnimationFrame(gameLoopRef.current);
                }
                return;
            }

            ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            if (shakeDuration > 0) {
                ctx.save();
                const dxShake = (Math.random() - 0.5) * shakeIntensity;
                const dyShake = (Math.random() - 0.5) * shakeIntensity;
                ctx.translate(dxShake, dyShake);
                shakeDuration--;
            }

            drawBricks();
            drawParticles();
            drawBall();
            drawPaddle();
            collisionDetection();

            if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) dx = -dx;
            if (y + dy < ballRadius) dy = -dy;

            else if (y + dy > canvas.height - ballRadius - 5) {
                if (x > paddleX && x < paddleX + paddleWidth) {
                    let collidePoint = x - (paddleX + paddleWidth / 2);
                    collidePoint = collidePoint / (paddleWidth / 2);
                    let angle = collidePoint * (Math.PI / 3);
                    dx = ballSpeed * Math.sin(angle);
                    dy = -ballSpeed * Math.cos(angle);
                    triggerScreenShake(3, 8);
                } else {
                    setGameState('gameOver');
                    triggerScreenShake(20, 30);
                }
            }

            if (rightPressed && paddleX < canvas.width - paddleWidth) paddleX += 7;
            else if (leftPressed && paddleX > 0) paddleX -= 7;

            x += dx;
            y += dy;

            if (shakeDuration > 0) {
                ctx.restore();
            }

            gameLoopRef.current = requestAnimationFrame(draw);
        };

        if (gameState === 'playing') {
            draw();
        } else {
            ctx.fillStyle = 'rgba(0, 0, 0, 1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        return () => {
            if (gameLoopRef.current) {
                cancelAnimationFrame(gameLoopRef.current);
            }
            document.removeEventListener("keydown", keyDownHandler);
            document.removeEventListener("keyup", keyUpHandler);
        };
    }, [gameState]);

    const startGame = () => {
        setScore(0);
        setGameState('playing');
    };

    const renderGameStateOverlay = () => {
        if (gameState === 'waiting') {
            return (
                <div className="absolute inset-0 bg-black/70 flex flex-col justify-center items-center backdrop-blur-sm">
                    <h3 className="text-5xl font-bold text-white mb-4 animate-pulse">CYBER BREAKER</h3>
                    <p className="text-cyan-400 mb-8">お楽しみコンテンツです</p>
                    <button
                        onClick={startGame}
                        className="px-8 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/50 transform hover:-translate-y-1"
                    >
                        ゲーム開始
                    </button>
                </div>
            );
        }
        if (gameState === 'gameOver') {
            return (
                <div className="absolute inset-0 bg-black/70 flex flex-col justify-center items-center backdrop-blur-sm">
                    <h3 className="text-5xl font-bold text-red-500 mb-4 animate-pulse">GAME OVER</h3>
                    <p className="text-white text-xl mb-8">SCORE: {score}</p>
                    <button
                        onClick={startGame}
                        className="px-8 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/50 transform hover:-translate-y-1"
                    >
                        リトライ
                    </button>
                </div>
            );
        }
        if (gameState === 'cleared') {
            return (
                <div className="absolute inset-0 bg-black/70 flex flex-col justify-center items-center backdrop-blur-sm">
                    <h3 className="text-5xl font-bold text-cyan-400 mb-4 animate-pulse">GAME CLEARED!</h3>
                    <p className="text-white text-xl mb-8">お見事！ SCORE: {score}</p>
                    <button
                        onClick={startGame}
                        className="px-8 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/50 transform hover:-translate-y-1"
                    >
                        もう一度プレイ
                    </button>
                </div>
            );
        }
        return null;
    };

    return (
        <section id="game" className="py-20 bg-gray-900/30 relative z-10">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-cyan-400 mb-6 flex items-center justify-center gap-4">
                        <Gamepad2 size={48} /> Mini Game
                    </h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto" />
                </div>
                <div className="relative aspect-video max-w-4xl mx-auto border-2 border-cyan-500/50 shadow-lg shadow-cyan-500/20 rounded-lg">
                    <canvas
                        ref={canvasRef}
                        width="800"
                        height="500"
                        className="w-full h-full bg-black rounded-lg"
                    />
                    {renderGameStateOverlay()}
                    <div className="absolute top-4 right-4 text-white font-mono text-2xl z-10">
                        SCORE: <span className="text-cyan-400 font-bold">{score}</span>
                    </div>
                </div>
                <p className="text-center mt-8 text-gray-400">
                    操作方法: 左右の矢印キーでパドルを動かします。
                </p>
            </div>
        </section>
    );
};

export default Game;