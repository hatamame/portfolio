import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Icosahedron } from '@react-three/drei';
import { Mesh } from 'three';
import { EffectComposer, Bloom, Glitch } from '@react-three/postprocessing';
import { GlitchMode } from 'postprocessing';
import { Vector2 } from 'three';

const CyberpunkObject = () => {
  const outerRef = useRef<Mesh>(null!);
  const innerRef = useRef<Mesh>(null!);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    if (outerRef.current) {
      outerRef.current.rotation.y += delta * 0.2;
      outerRef.current.rotation.x += delta * 0.1;

      // Add random glitchy jumps
      if (Math.random() > 0.98) {
        outerRef.current.rotation.x += (Math.random() - 0.5) * 0.5;
        outerRef.current.rotation.y += (Math.random() - 0.5) * 0.5;
      }
    }
    if (innerRef.current) {
      innerRef.current.rotation.y -= delta * 0.8;
      innerRef.current.rotation.x -= delta * 0.8;
      const scale = 1 + 0.15 * Math.sin(time * 5);
      innerRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group>
      {/* Outer Wireframe Shell */}
      <Icosahedron ref={outerRef} args={[2.5, 1]}>
        <meshStandardMaterial
          wireframe
          color="#ff007f"
          emissive="#ff007f"
          emissiveIntensity={2}
          roughness={0.2}
          metalness={0.8}
        />
      </Icosahedron>
      {/* Inner Glowing Core */}
      <Icosahedron ref={innerRef} args={[1, 0]}>
        <meshStandardMaterial
          color="#00f5ff"
          emissive="#00f5ff"
          emissiveIntensity={6}
          toneMapped={false} // Make it glow intensely
        />
      </Icosahedron>
    </group>
  );
};

const Scene3D = ({ scrollProgress }: { scrollProgress: number }) => {
  return (
    <Canvas camera={{ position: [0, 0, 8] }}>
      <ambientLight intensity={0.1} />
      <pointLight position={[10, 10, 10]} color="#00f5ff" intensity={5} />
      <pointLight position={[-10, -10, -10]} color="#ff007f" intensity={5} />
      <CyberpunkObject />
      <OrbitControls enableZoom={false} enablePan={false} />
      <EffectComposer>
        <Bloom intensity={0.6} luminanceThreshold={0.1} luminanceSmoothing={0.9} mipmapBlur />
        <Glitch
          delay={new Vector2(1.5, 3.5)}
          duration={new Vector2(0.2, 0.5)}
          strength={new Vector2(scrollProgress * 0.1, scrollProgress * 0.1)}
          mode={GlitchMode.SPORADIC}
          active
          ratio={0.85}
        />
      </EffectComposer>
    </Canvas>
  );
};

export default Scene3D;