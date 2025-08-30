"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

function Crayon() {
  const meshRef = useRef<THREE.Group>(null);
  
  // Gentle rotation animation
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group ref={meshRef} position={[0, 0, 0]}>
      {/* Crayon body */}
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.5, 0.5, 4, 64]} />
        <meshStandardMaterial 
          color="#8B7FF7" 
          roughness={0.3}
          metalness={0.1}
          emissive="#8B7FF7"
          emissiveIntensity={0.1}
        />
      </mesh>
      
      {/* Crayon tip (cone) */}
      <mesh position={[0, 2.5, 0]} castShadow>
        <coneGeometry args={[0.5, 1, 64]} />
        <meshStandardMaterial 
          color="#6B5FD7"
          roughness={0.4}
          metalness={0}
        />
      </mesh>
      
      {/* Crayon wrapper/label */}
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[0.52, 0.52, 2.5, 64]} />
        <meshStandardMaterial 
          color="#1a1a1a"
          roughness={0.8}
          metalness={0}
        />
      </mesh>
      
      {/* Label text band */}
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[0.53, 0.53, 0.5, 64]} />
        <meshStandardMaterial 
          color="#ffffff"
          roughness={0.9}
          metalness={0}
          emissive="#ffffff"
          emissiveIntensity={0.05}
        />
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
        
        {/* Lighting setup - subtle and elegant */}
        <ambientLight intensity={0.3} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={0.9}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <pointLight position={[-5, 2, -5]} intensity={0.4} color="#8B7FF7" />
        <pointLight position={[5, -2, 5]} intensity={0.25} color="#FF6257" />
        
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