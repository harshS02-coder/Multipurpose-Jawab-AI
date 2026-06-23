import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Float,
  Environment,
  useGLTF,
  PresentationControls,
  ContactShadows,
} from "@react-three/drei";

// 🔁 SWAP THIS with your own hosted .glb / .gltf model
const MODEL_URL = "[your-cdn.com](https://YOUR-CDN.com/models/jawab-document.glb)";

function Model() {
  const { scene } = useGLTF(MODEL_URL);
  return <primitive object={scene} scale={1.6} />;
}

// Procedural fallback so the scene renders without an external model
function FallbackDoc() {
  return (
    <group>
      <mesh rotation={[0.2, -0.4, 0]} castShadow>
        <boxGeometry args={[2, 2.7, 0.12]} />
        <meshStandardMaterial
          color="#a855f7"
          emissive="#22d3ee"
          emissiveIntensity={0.4}
          metalness={0.6}
          roughness={0.2}
        />
      </mesh>
      <mesh position={[0, 0, 0.07]}>
        <planeGeometry args={[1.5, 2.1]} />
        <meshStandardMaterial color="#0d0d1a" emissive="#22d3ee" emissiveIntensity={0.15} />
      </mesh>
    </group>
  );
}

export default function Scene3D() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 40 }}
      className="h-full w-full"
      dpr={[1, 2]}
    >
      <ambientLight intensity={0.6} />
      <spotLight position={[8, 8, 8]} angle={0.3} penumbra={1} intensity={1.2} color="#22d3ee" />
      <pointLight position={[-6, -4, -4]} intensity={0.8} color="#a855f7" />

      <Suspense fallback={null}>
        <PresentationControls
          global
          rotation={[0, 0, 0]}
          polar={[-0.3, 0.3]}
          azimuth={[-0.6, 0.6]}
        >
          <Float speed={2} rotationIntensity={0.6} floatIntensity={1.2}>
            {/* Use <Model /> once you've added MODEL_URL; fallback shown by default */}
            <FallbackDoc />
            {/* <Model /> */}
          </Float>
        </PresentationControls>
        <ContactShadows position={[0, -2.4, 0]} opacity={0.4} blur={2.5} far={4} />
        <Environment preset="city" />
      </Suspense>
    </Canvas>
  );
}

// useGLTF.preload(MODEL_URL); // uncomment once MODEL_URL is real
