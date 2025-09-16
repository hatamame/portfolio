
import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, TorusKnot } from '@react-three/drei';
import { Mesh } from 'three';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

const FuturisticObject = () => {
  const outerRef = useRef<Mesh>(null!);
  const innerRef = useRef<Mesh>(null!);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    const mouseX = state.mouse.x;
    const mouseY = state.mouse.y;

    if (outerRef.current) {
      outerRef.current.rotation.y += (mouseX - outerRef.current.rotation.y) * 0.05;
      outerRef.current.rotation.x += (-mouseY - outerRef.current.rotation.x) * 0.05;
    }
    if (innerRef.current) {
      innerRef.current.rotation.y -= delta * 0.5;
      innerRef.current.rotation.x -= delta * 0.5;
      const scale = 1 + 0.1 * Math.sin(time * 2);
      innerRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group rotation-y={Math.PI / 4}>
      <TorusKnot ref={outerRef} args={[1.8, 0.5, 200, 32]}>
        <meshPhysicalMaterial
          roughness={0.05}
          metalness={0.1}
          transmission={1.0}
          ior={1.33}
          thickness={1.5}
          transparent
        />
      </TorusKnot>
      <TorusKnot ref={innerRef} args={[0.8, 0.2, 100, 16]}>
        <meshStandardMaterial color="#00f5ff" emissive="#00f5ff" emissiveIntensity={4} />
      </TorusKnot>
    </group>
  );
};

const Scene3D = () => {
  return (
    <Canvas camera={{ position: [0, 0, 7] }}>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} color="#00f5ff" intensity={3} />
      <pointLight position={[-10, -10, -10]} color="#ff007f" intensity={3} />
      <FuturisticObject />
      <OrbitControls enableZoom={false} enablePan={false} />
      <EffectComposer>
        <Bloom intensity={0.8} luminanceThreshold={0.1} luminanceSmoothing={0.9} mipmapBlur />
      </EffectComposer>
    </Canvas>
  );
};

export default Scene3D;
