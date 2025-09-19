import { FC, useEffect, useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, TorusKnot, Stars } from '@react-three/drei';
import { EffectComposer, Bloom, Glitch, Scanline, ChromaticAberration } from '@react-three/postprocessing';
import { GlitchMode } from 'postprocessing';
import { Vector2, MathUtils, Mesh } from 'three';

// 画面に表示するランダムな文字列を生成
const generateRandomString = (length: number) => {
    const chars = 'AZERTYUIOPQSDFGHJKLMWXCVBN0123456789%$#@*&?!';
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};

// 背景のグリッド
const Grid = () => (
    <gridHelper args={[200, 100, '#ff007f', '#00f5ff']} rotation-x={Math.PI / 2} />
);

// 回転するオブジェクト
const RotatingObject = () => {
    const meshRef = useRef<Mesh>(null!);
    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.x = MathUtils.lerp(meshRef.current.rotation.x, Math.sin(state.clock.elapsedTime / 2) * 2, 0.1);
            meshRef.current.rotation.y = MathUtils.lerp(meshRef.current.rotation.y, Math.cos(state.clock.elapsedTime / 2) * 2, 0.1);
            meshRef.current.rotation.z += delta * 0.1;
        }
    });

    return (
        <TorusKnot ref={meshRef} args={[1.5, 0.4, 256, 32]}>
            <meshStandardMaterial wireframe color="#fff" emissive="#00f5ff" emissiveIntensity={2} />
        </TorusKnot>
    );
};

// ちらつくテキスト
const GlitchyText = ({ text, position, fontSize }: { text: string; position: [number, number, number], fontSize: number }) => (
    <Text position={position} fontSize={fontSize} color="#00f5ff" anchorX="center" anchorY="middle" letterSpacing={0.2}>
        {text}
        <meshStandardMaterial emissive="#00f5ff" emissiveIntensity={4} toneMapped={false} />
    </Text>
);

// カメラ
const AnimatedCamera = ({ targetZ }: { targetZ: number }) => {
    useFrame(state => {
        state.camera.position.z = MathUtils.lerp(state.camera.position.z, targetZ, 0.02);
        state.camera.lookAt(0, 0, 0);
    });
    return null;
};

interface SpecialAnimationProps {
    onFinished: () => void;
}

const SpecialAnimation: FC<SpecialAnimationProps> = ({ onFinished }) => {
    const [isBooting, setIsBooting] = useState(true);
    const [randomTexts, setRandomTexts] = useState<string[]>([]);
    const [finalMessage, setFinalMessage] = useState('');
    const [isExiting, setIsExiting] = useState(false);
    const [glitchActive, setGlitchActive] = useState(true);
    const [cameraTargetZ, setCameraTargetZ] = useState(5);
    const fullFinalMessage = 'WELCOME TO THE DEEP LAYER';

    useEffect(() => {
        const bootTimeout = setTimeout(() => {
            setIsBooting(false);
        }, 2000); // 2秒間のブートシーケンス

        return () => clearTimeout(bootTimeout);
    }, []);

    useEffect(() => {
        if (isBooting) return;

        const textInterval = setInterval(() => {
            setRandomTexts(Array.from({ length: 5 }, () => generateRandomString(Math.floor(Math.random() * 15) + 5)));
        }, 150);

        const finalTimeout = setTimeout(() => {
            clearInterval(textInterval);
            setRandomTexts([]);
            setGlitchActive(false);
            setCameraTargetZ(15);

            setTimeout(() => {
                let i = 0;
                const typingInterval = setInterval(() => {
                    setFinalMessage(fullFinalMessage.substring(0, i + 1));
                    i++;
                    if (i > fullFinalMessage.length) {
                        clearInterval(typingInterval);
                    }
                }, 100);
            }, 1000);

        }, 8000);

        const exitTimeout = setTimeout(() => {
            setIsExiting(true);
            setTimeout(onFinished, 1500);
        }, 14000); // 全体の時間を調整

        return () => {
            clearInterval(textInterval);
            clearTimeout(finalTimeout);
            clearTimeout(exitTimeout);
        };
    }, [isBooting, onFinished]);

    const textPositions = useMemo(() => [
        [0, 4, -2],
        [-8, -3, -7],
        [10, 2, -12],
        [2, -6, -5],
        [-12, 5, -10]
    ], []);

    return (
        <div className={`fixed inset-0 bg-black z-[100] transition-opacity duration-1000 ${isExiting ? 'opacity-0' : 'opacity-100'} crt-vignette crt-scanlines`}>
            {isBooting ? (
                <div className="boot-container w-full h-full flex items-center justify-center overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-cyan-400/80 shadow-[0_0_15px_5px_rgba(34,211,238,0.7)] animate-crt-reveal z-[103]" />
                    <p className="text-2xl md:text-4xl text-cyan-400 font-mono animate-crt-text tracking-widest">
                        &gt; SYSTEM BOOT...
                    </p>
                </div>
            ) : (
                <Canvas camera={{ position: [0, 0, 20], fov: 75 }}>
                    <ambientLight intensity={0.2} />
                    <Grid />
                    <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                    <RotatingObject />
                    <AnimatedCamera targetZ={cameraTargetZ} />

                    {randomTexts.map((text, i) => (
                        <GlitchyText key={i} text={text} position={textPositions[i] as [number, number, number]} fontSize={0.5} />
                    ))}

                    {finalMessage && (
                        <Text position={[0, 0, 4]} fontSize={1.2} color="white" anchorX="center" anchorY="middle" letterSpacing={0.3}>
                            {finalMessage}
                            <meshStandardMaterial emissive="#fff" emissiveIntensity={2} toneMapped={false} />
                        </Text>
                    )}

                    <EffectComposer>
                        <Bloom intensity={1.2} luminanceThreshold={0.1} luminanceSmoothing={0.8} mipmapBlur />
                        <Scanline density={1.5} opacity={0.2} />
                        <Glitch
                            delay={new Vector2(1.5, 3.5)}
                            duration={new Vector2(0.2, 0.5)}
                            strength={new Vector2(0.05, 0.1)}
                            mode={GlitchMode.SPORADIC}
                            active={glitchActive}
                        />
                        <ChromaticAberration offset={new Vector2(0.002, 0.002)} />
                    </EffectComposer>
                </Canvas>
            )}
        </div>
    );
};

export default SpecialAnimation;