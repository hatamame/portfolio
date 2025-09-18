import { FC, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Icosahedron } from '@react-three/drei';
import { EffectComposer, Bloom, Glitch } from '@react-three/postprocessing';
import { GlitchMode } from 'postprocessing';
import { Vector2 } from 'three';
import { Mesh } from 'three';

// 画面に表示するランダムな文字列を生成
const generateRandomString = (length: number) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789%$#@*&^';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

// 背景のグリッド
const Grid = () => (
    <gridHelper args={[100, 50, '#ff007f', '#00f5ff']} rotation-x={Math.PI / 2} />
);

// 回転するオブジェクト
const RotatingObject = () => {
    const meshRef = useRef<Mesh>(null!);
    useFrame((_, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.x += delta * 0.2;
            meshRef.current.rotation.y += delta * 0.3;
        }
    });

    return (
        <Icosahedron ref={meshRef} args={[2, 1]}>
            <meshStandardMaterial wireframe color="#fff" emissive="#00f5ff" emissiveIntensity={2} />
        </Icosahedron>
    );
};

// ちらつくテキスト
const GlitchyText = ({ text, position, fontSize }: { text: string; position: [number, number, number], fontSize: number }) => (
    <Text position={position} fontSize={fontSize} color="#00f5ff" anchorX="center" anchorY="middle">
        {text}
        <meshStandardMaterial emissive="#00f5ff" emissiveIntensity={3} toneMapped={false} />
    </Text>
);

interface SpecialAnimationProps {
    onFinished: () => void;
}

const SpecialAnimation: FC<SpecialAnimationProps> = ({ onFinished }) => {
    const [randomText, setRandomText] = useState(generateRandomString(20));
    const [finalMessage, setFinalMessage] = useState('');
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        const textInterval = setInterval(() => {
            setRandomText(generateRandomString(Math.floor(Math.random() * 20) + 10));
        }, 100);

        // 8秒後に最終メッセージを表示
        const finalTimeout = setTimeout(() => {
            clearInterval(textInterval);
            setRandomText('');
            setFinalMessage('WELCOME TO THE DEEP LAYER');
        }, 8000);

        // 10秒後にアニメーションを終了
        const exitTimeout = setTimeout(() => {
            setIsExiting(true);
            setTimeout(onFinished, 1000); // フェードアウトの時間
        }, 16000);

        return () => {
            clearInterval(textInterval);
            clearTimeout(finalTimeout);
            clearTimeout(exitTimeout);
        };
    }, [onFinished]);

    return (
        <div className={`fixed inset-0 bg-black z-[100] transition-opacity duration-1000 ${isExiting ? 'opacity-0' : 'opacity-100'}`}>
            <Canvas camera={{ position: [0, 0, 15], fov: 75 }}>
                <ambientLight intensity={0.5} />
                <Grid />
                <RotatingObject />

                {/* ランダムなテキストを複数配置 */}
                <GlitchyText text={randomText} position={[0, 5, 0]} fontSize={1} />
                <GlitchyText text={generateRandomString(10)} position={[-8, -4, -5]} fontSize={0.5} />
                <GlitchyText text={generateRandomString(15)} position={[10, 2, -10]} fontSize={0.7} />

                {/* 最終メッセージ */}
                {finalMessage && (
                    <Text position={[0, 0, 5]} fontSize={1.5} color="white" anchorX="center" anchorY="middle">
                        {finalMessage}
                    </Text>
                )}

                <EffectComposer>
                    <Bloom intensity={1.5} luminanceThreshold={0.2} luminanceSmoothing={0.9} mipmapBlur />
                    <Glitch
                        delay={new Vector2(0.5, 1.5)}
                        duration={new Vector2(0.1, 0.3)}
                        strength={new Vector2(0.1, 0.3)}
                        mode={GlitchMode.SPORADIC}
                        active
                    />
                </EffectComposer>
            </Canvas>
        </div>
    );
};

export default SpecialAnimation;