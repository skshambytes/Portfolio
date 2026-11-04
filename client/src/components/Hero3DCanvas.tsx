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
function ParticleField({ count = 450 }: { count?: number }) {
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
      pointsRef.current.rotation.y += delta * 0.02;
      pointsRef.current.rotation.x += delta * 0.01;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        vertexColors
        transparent
        opacity={0.35}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// Parallax Group Controller with Pointer & Device Orientation
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
      rigGroupRef.current.rotation.y = Math.sin(t * 0.15) * 0.04;
      rigGroupRef.current.rotation.x = Math.cos(t * 0.15) * 0.02;
      return;
    }

    // Combine subtle pointer and gyroscope parallax
    const targetX = (pointerPos.x * 0.08) + (gyroPos.gamma * 0.002);
    const targetY = (-pointerPos.y * 0.08) + (gyroPos.beta * 0.002);

    // Smooth lerp damping
    rigGroupRef.current.rotation.y = THREE.MathUtils.damp(rigGroupRef.current.rotation.y, targetX, 3.0, delta);
    rigGroupRef.current.rotation.x = THREE.MathUtils.damp(rigGroupRef.current.rotation.x, targetY, 3.0, delta);
  });

  return (
    <group ref={rigGroupRef}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1.2} color="#00f2fe" />
      <pointLight position={[-5, -5, -5]} intensity={0.8} color="#0ea5e9" />
      {/* Clean, ambient data starfield without any obstructing 3D geometric shapes */}
      <ParticleField count={typeof window !== 'undefined' && window.innerWidth < 768 ? 180 : 400} />
    </group>
  );
}

// Fallback when WebGL is unavailable or disabled
function CanvasFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden bg-transparent pointer-events-none">
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
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-transparent">
      <Suspense fallback={<CanvasFallback />}>
        <Canvas
          dpr={[1, 2]} // Cap pixel ratio at 2 for performance
          camera={{ position: [0, 0, 7], fov: 45 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
          }}
          style={{ background: 'transparent', pointerEvents: 'none' }}
          className="w-full h-full pointer-events-none"
          onCreated={({ gl }) => {
            // Explicitly set clear color with 0 alpha to prevent any opaque white buffer rendering
            gl.setClearColor(0x000000, 0);
          }}
        >
          <SceneRig pointerPos={pointer} gyroPos={gyro} prefersReducedMotion={prefersReducedMotion} />
        </Canvas>
      </Suspense>
    </div>
  );
};
