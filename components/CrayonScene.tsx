"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

const COLOR_RED = "#E8402A";
const COLOR_ORANGE = "#F7751D";
const COLOR_YELLOW = "#F6C019";
const COLOR_CREAM = "#fbfaf7";

function applyVerticalGradient(
  geometry: THREE.BufferGeometry,
  topHex: string,
  bottomHex: string,
  yMinOverride?: number,
  yMaxOverride?: number,
) {
  const positions = geometry.attributes.position;
  const count = positions.count;
  const colors = new Float32Array(count * 3);

  let actualMin = Infinity;
  let actualMax = -Infinity;
  for (let i = 0; i < count; i++) {
    const y = positions.getY(i);
    if (y < actualMin) actualMin = y;
    if (y > actualMax) actualMax = y;
  }
  const minY = yMinOverride ?? actualMin;
  const maxY = yMaxOverride ?? actualMax;
  const span = maxY - minY || 1;

  const top = new THREE.Color(topHex);
  const bot = new THREE.Color(bottomHex);
  const tmp = new THREE.Color();

  for (let i = 0; i < count; i++) {
    const raw = (positions.getY(i) - minY) / span;
    const t = Math.max(0, Math.min(1, raw));
    tmp.copy(bot).lerp(top, t);
    colors[i * 3] = tmp.r;
    colors[i * 3 + 1] = tmp.g;
    colors[i * 3 + 2] = tmp.b;
  }

  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  return geometry;
}

function Crayon() {
  const meshRef = useRef<THREE.Group>(null);

  // Body: orange → yellow mapped onto just the visible wax above the sleeve.
  // Body cylinder spans local y = -2 to +2 (centered). The sleeve covers up to
  // local y = 1.25 (i.e. world y = 0.25), so the gradient is mapped from there
  // up to y = 2. Vertices below that boundary clamp to yellow (hidden under the
  // sleeve anyway).
  const bodyGeometry = useMemo(() => {
    const geo = new THREE.CylinderGeometry(0.5, 0.5, 4, 64);
    return applyVerticalGradient(geo, COLOR_ORANGE, COLOR_YELLOW, 1.25, 2);
  }, []);

  // Tip: red (top) → orange (bottom, joins body cleanly)
  const tipGeometry = useMemo(() => {
    const geo = new THREE.ConeGeometry(0.5, 1, 64);
    return applyVerticalGradient(geo, COLOR_RED, COLOR_ORANGE);
  }, []);

  // Gentle rotation animation
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group ref={meshRef} position={[0, 0, 0]}>
      {/* Tip — red → orange */}
      <mesh position={[0, 1.95, 0]} geometry={tipGeometry} castShadow>
        <meshStandardMaterial vertexColors roughness={0.45} metalness={0.05} />
      </mesh>

      {/* Body — orange → yellow */}
      <mesh position={[0, -0.5, 0]} geometry={bodyGeometry} castShadow>
        <meshStandardMaterial vertexColors roughness={0.45} metalness={0.05} />
      </mesh>

      {/* Paper sleeve wrapping the lower body — brand red */}
      <mesh position={[0, -1.0, 0]}>
        <cylinderGeometry args={[0.56, 0.56, 2.5, 64]} />
        <meshStandardMaterial color={COLOR_RED} roughness={0.85} metalness={0} />
      </mesh>

      {/* Cream label band on the sleeve */}
      <mesh position={[0, -1.0, 0]}>
        <cylinderGeometry args={[0.57, 0.57, 0.5, 64]} />
        <meshStandardMaterial color={COLOR_CREAM} roughness={0.95} metalness={0} />
      </mesh>
    </group>
  );
}

export default function CrayonScene() {
  return (
    <div className="h-[400px] w-full max-w-[400px] mx-auto">
      <Canvas
        shadows
        gl={{ antialias: true, alpha: true }}
        className="touch-none"
      >
        <PerspectiveCamera makeDefault position={[0, 0, 9]} fov={45} />

        {/* Lighting — bright ambient for the paper bg, warm fills to lift the wax */}
        <ambientLight intensity={0.85} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={0.95}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <pointLight position={[-5, 2, -5]} intensity={0.4} color={COLOR_YELLOW} />
        <pointLight position={[5, -2, 5]} intensity={0.3} color={COLOR_RED} />

        {/* The crayon */}
        <Crayon />

        {/* Subtle controls for desktop */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
          autoRotate={false}
        />
      </Canvas>
    </div>
  );
}
