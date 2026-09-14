"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Bounds, Center, OrbitControls, useGLTF } from "@react-three/drei";

function GltfModel({ src }: { src: string }) {
  const { scene } = useGLTF(src);
  return <primitive object={scene} />;
}

function DemoModel() {
  return (
    <mesh>
      <torusKnotGeometry args={[0.9, 0.28, 160, 32]} />
      <meshStandardMaterial color="#b5b5b5" roughness={0.3} metalness={0.6} />
    </mesh>
  );
}

export default function ModelScene({
  src,
  autoRotate = true,
}: {
  src?: string;
  autoRotate?: boolean;
}) {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 2]}>
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 6, 5]} intensity={1.4} />
      <directionalLight position={[-5, -3, -5]} intensity={0.4} />
      <Suspense fallback={null}>
        <Bounds fit clip observe margin={1.2}>
          <Center>{src ? <GltfModel src={src} /> : <DemoModel />}</Center>
        </Bounds>
      </Suspense>
      <OrbitControls
        makeDefault
        enablePan={false}
        autoRotate={autoRotate}
        autoRotateSpeed={0.8}
        minDistance={2}
        maxDistance={14}
      />
    </Canvas>
  );
}
