'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PARTICLE_COUNT } from '@/lib/three/constants';
import { useDeviceTier } from '@/hooks/useDeviceTier';
import { useThemePalette } from '@/lib/three/themeUniforms';

const SPREAD = 14; // world units — larger than the visible frustum

/**
 * Site-wide ambient particle field (the 3D successor to the 2D CanvasBackground).
 * Instanced points with gentle drift + pointer parallax. Runs on every route so
 * transitions never feel jarring. Count scales with device tier.
 */
export default function ParticleField() {
  const tier = useDeviceTier();
  const palette = useThemePalette();
  const count = PARTICLE_COUNT[tier];
  const pointsRef = useRef<THREE.Points>(null);
  const groupRef = useRef<THREE.Group>(null);

  // Build positions + per-particle speeds once (or when count changes).
  const { positions, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * SPREAD;
      positions[i * 3 + 1] = (Math.random() - 0.5) * SPREAD;
      positions[i * 3 + 2] = (Math.random() - 0.5) * SPREAD;
      speeds[i] = 0.02 + Math.random() * 0.05;
    }
    return { positions, speeds };
  }, [count]);

  // Theme-reactive color (warm/cool accent).
  const color = useMemo(() => {
    // blend c1 and c3 for a mid ambient tint
    return palette.c1.clone().lerp(palette.c3, 0.5);
  }, [palette]);

  useFrame((state, delta) => {
    const pts = pointsRef.current;
    const group = groupRef.current;
    if (!pts || !group) return;

    const pos = pts.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      // gentle upward drift; wrap around when leaving the spread
      pos[i * 3 + 1] += speeds[i] * delta;
      if (pos[i * 3 + 1] > SPREAD / 2) pos[i * 3 + 1] = -SPREAD / 2;
    }
    pts.geometry.attributes.position.needsUpdate = true;

    // subtle pointer parallax on the whole field
    const tx = state.pointer.x * 0.5;
    const ty = state.pointer.y * 0.5;
    group.rotation.y += (tx - group.rotation.y) * 0.02;
    group.rotation.x += (ty - group.rotation.x) * 0.02;
  });

  return (
    <group ref={groupRef}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color={color}
          size={0.04}
          sizeAttenuation
          transparent
          opacity={0.6}
          depthWrite={false}
        />
      </points>
    </group>
  );
}
