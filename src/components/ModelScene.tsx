"use client";

import {
  Suspense,
  useLayoutEffect,
  useRef,
  type ReactNode,
  type RefObject,
} from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Box3, TOUCH, Vector3, type Group } from "three";
import type { Controls } from "./ModelViewer";

// Every model is scaled so its largest side is SIZE units and centered on the
// origin, so the camera distance and zoom limits suit it whatever unit it was
// exported in (a 0.3-unit model used to render tiny).
const SIZE = 2;

// OrbitControls ignores touch modes it doesn't know: one finger does nothing
// (the page scrolls), two fingers rotate and pinch-zoom.
const NO_TOUCH = -1 as unknown as TOUCH;

function Normalized({ src, children }: { src?: string; children: ReactNode }) {
  const ref = useRef<Group>(null);

  useLayoutEffect(() => {
    const group = ref.current;
    if (!group) return;
    group.scale.setScalar(1);
    group.position.set(0, 0, 0);
    group.updateMatrixWorld(true);
    const box = new Box3().setFromObject(group);
    if (box.isEmpty()) return;
    const size = box.getSize(new Vector3());
    const scale = SIZE / (Math.max(size.x, size.y, size.z) || 1);
    group.scale.setScalar(scale);
    group.position.copy(box.getCenter(new Vector3())).multiplyScalar(-scale);
  }, [src]);

  return <group ref={ref}>{children}</group>;
}

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
  controlsRef,
  autoRotate,
  onInteract,
}: {
  src?: string;
  controlsRef: RefObject<Controls | null>;
  autoRotate: boolean;
  onInteract: () => void;
}) {
  return (
    // ~4.2 units away: a SIZE-2 model fills the view without clipping as it turns.
    <Canvas camera={{ position: [2.6, 1.6, 2.9], fov: 45 }} dpr={[1, 2]}>
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 6, 5]} intensity={1.4} />
      <directionalLight position={[-5, -3, -5]} intensity={0.4} />
      <Suspense fallback={null}>
        <Normalized src={src}>
          {src ? <GltfModel src={src} /> : <DemoModel />}
        </Normalized>
      </Suspense>
      <OrbitControls
        ref={controlsRef}
        makeDefault
        enablePan={false}
        autoRotate={autoRotate}
        autoRotateSpeed={0.8}
        minDistance={1.5}
        maxDistance={12}
        touches={{ ONE: NO_TOUCH, TWO: TOUCH.DOLLY_ROTATE }}
        onStart={onInteract}
      />
    </Canvas>
  );
}
