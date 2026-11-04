import React, { useRef, useMemo, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Check if WebGL is available
function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch {
    return false;
  }
}

// 1. Data Particle Field
function ParticleField({ count = 600 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null!);

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const cyan = new THREE.Color('#00f2fe');
    const blue = new THREE.Color('#0ea5e9');
    const darkBlue = new THREE.Color('#0284c7');

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15;

      const mixed = Math.random() > 0.5 ? cyan : Math.random() > 0.5 ? blue : darkBlue;
      col[i * 3] = mixed.r;
      col[i * 3 + 1] = mixed.g;
      col[i * 3 + 2] = mixed.b;
    }

    return [pos, col];
  }, [count]);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.03;
      pointsRef.current.rotation.x += delta * 0.015;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.35}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// 2. 3D Floating Data Chart Bars - Positioned safely in bottom-right background periphery
function DataBars() {
  const groupRef = useRef<THREE.Group>(null!);
  const barCount = 6;
  const bars = useMemo(() => {
    return Array.from({ length: barCount }, (_, i) => ({
      x: (i - barCount / 2) * 0.55,
      initialHeight: 0.8 + Math.sin(i * 0.8) * 0.6,
      speed: 1.0 + i * 0.15,
      phase: i * 0.6,
    }));
  }, []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    groupRef.current.children.forEach((mesh, index) => {
      const bar = bars[index];
      if (bar) {
        const scaleY = Math.max(0.2, bar.initialHeight + Math.sin(t * bar.speed + bar.phase) * 0.4);
        mesh.scale.set(1, scaleY, 1);
        mesh.position.y = -1.2 + scaleY * 0.4;
      }
    });
  });

  return (
    // Relocated to far right-bottom periphery [4.6, -2.4, -3] to keep text 100% unobstructed
    <group ref={groupRef} position={[4.6, -2.2, -3]}>
      {bars.map((bar, i) => (
        <mesh key={i} position={[bar.x, -0.6, 0]}>
          <boxGeometry args={[0.3, 0.8, 0.3]} />
          <meshStandardMaterial
            color="#0ea5e9"
            emissive="#00f2fe"
            emissiveIntensity={0.2}
            roughness={0.3}
            metalness={0.8}
            wireframe={i % 2 === 1}
            transparent
            opacity={0.55}
          />
        </mesh>
      ))}
    </group>
  );
}

// 3. Ambient Holographic Data Cube - Positioned in the upper-right corner background
function DataCube() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const innerRef = useRef<THREE.Mesh>(null!);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.25;
    }
    if (innerRef.current) {
      innerRef.current.rotation.x -= delta * 0.3;
      innerRef.current.rotation.y -= delta * 0.25;
    }
  });

  return (
    // Relocated to upper-right background periphery [4.2, 2.3, -3] to keep headline & bio 100% unobstructed
    <group position={[4.2, 2.3, -3]}>
      {/* Outer subtle wireframe analytical cube */}
      <mesh ref={meshRef}>
        <boxGeometry args={[1.3, 1.3, 1.3]} />
        <meshStandardMaterial
          color="#00f2fe"
          wireframe
          transparent
          opacity={0.3}
          emissive="#00f2fe"
          emissiveIntensity={0.2}
        />
      </mesh>
      {/* Inner translucent rotating core */}
      <mesh ref={innerRef}>
        <octahedronGeometry args={[0.6]} />
        <meshStandardMaterial
          color="#0284c7"
          wireframe
          transparent
          opacity={0.4}
          emissive="#00f2fe"
          emissiveIntensity={0.3}
          roughness={0.2}
          metalness={0.9}
        />
      </mesh>
    </group>
  );
}

// 4. Parallax Group Controller with Pointer & Device Orientation
function SceneRig({
  pointerPos,
  gyroPos,
  prefersReducedMotion,
}: {
  pointerPos: { x: number; y: number };
  gyroPos: { beta: number; gamma: number };
  prefersReducedMotion: boolean;
}) {
  const rigGroupRef = useRef<THREE.Group>(null!);

  useFrame((state, delta) => {
    if (!rigGroupRef.current) return;

    if (prefersReducedMotion) {
      // Gentle auto-sway only
      const t = state.clock.getElapsedTime();
      rigGroupRef.current.rotation.y = Math.sin(t * 0.2) * 0.05;
      rigGroupRef.current.rotation.x = Math.cos(t * 0.2) * 0.03;
      return;
    }

    // Combine subtle pointer and gyroscope parallax with limited amplitude to prevent wide sway
    const targetX = (pointerPos.x * 0.12) + (gyroPos.gamma * 0.003);
    const targetY = (-pointerPos.y * 0.12) + (gyroPos.beta * 0.003);

    // Smooth lerp damping
    rigGroupRef.current.rotation.y = THREE.MathUtils.damp(rigGroupRef.current.rotation.y, targetX, 3.5, delta);
    rigGroupRef.current.rotation.x = THREE.MathUtils.damp(rigGroupRef.current.rotation.x, targetY, 3.5, delta);
  });

  const isWideScreen = typeof window !== 'undefined' && window.innerWidth >= 1024;

  return (
    <group ref={rigGroupRef}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1.2} color="#00f2fe" />
      <pointLight position={[-5, -5, -5]} intensity={0.8} color="#0ea5e9" />
      <ParticleField count={typeof window !== 'undefined' && window.innerWidth < 768 ? 200 : 450} />
      {/* 3D Data Cube and Bars are placed strictly on the far right periphery on wide viewports */}
      {isWideScreen && <DataCube />}
      {isWideScreen && <DataBars />}
    </group>
  );
}

// Fallback when WebGL is unavailable or disabled
function CanvasFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden bg-[#090d16]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-950/20 via-[#090d16] to-[#090d16]" />
      <div className="h-72 w-72 rounded-full border border-cyan-500/20 animate-pulse-slow blur-xl" />
      <div className="absolute h-96 w-96 rounded-full border border-blue-500/10 animate-float-slow" />
    </div>
  );
}

export const Hero3DCanvas: React.FC = () => {
  const [hasWebGL, setHasWebGL] = useState(true);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [gyro, setGyro] = useState({ beta: 0, gamma: 0 });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    setHasWebGL(isWebGLAvailable());

    // Check prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handleMotionChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleMotionChange);

    // Mouse pointer listener
    const handleMouseMove = (e: MouseEvent) => {
      // Normalized coordinates from -1 to 1
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setPointer({ x, y });
    };

    // Device Orientation Listener for Mobile
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.beta !== null && e.gamma !== null) {
        setGyro({
          beta: THREE.MathUtils.clamp(e.beta - 45, -30, 30),
          gamma: THREE.MathUtils.clamp(e.gamma, -30, 30),
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation, { passive: true });
    }

    return () => {
      mediaQuery.removeEventListener('change', handleMotionChange);
      window.removeEventListener('mousemove', handleMouseMove);
      if (window.DeviceOrientationEvent) {
        window.removeEventListener('deviceorientation', handleOrientation);
      }
    };
  }, []);

  if (!hasWebGL) {
    return <CanvasFallback />;
  }

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      <Suspense fallback={<CanvasFallback />}>
        <Canvas
          dpr={[1, 2]} // Cap pixel ratio at 2 for mobile Lighthouse optimization
          camera={{ position: [0, 0, 7], fov: 45 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
          }}
          className="w-full h-full"
        >
          <SceneRig pointerPos={pointer} gyroPos={gyro} prefersReducedMotion={prefersReducedMotion} />
        </Canvas>
      </Suspense>
    </div>
  );
};
