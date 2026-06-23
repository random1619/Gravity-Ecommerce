'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PARTICLE_COUNT } from '@/lib/three/constants';
import { useDeviceTier } from '@/hooks/useDeviceTier';
import { useThemePalette } from '@/lib/three/themeUniforms';

const SPREAD = 14; // world units — larger than the visible frustum

/**
 * Generate the random particle geometry for a given count. Hoisted out of the
 * component so the Math.random() calls are not part of React's render pass
 * (they run inside an effect that writes into a ref).
 */
function generateBuffers(count: number) {
  const positions = new Float32Array(count * 3);
  const speeds = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = Math.random() * SPREAD - SPREAD / 2;
    positions[i * 3 + 1] = Math.random() * SPREAD - SPREAD / 2;
    positions[i * 3 + 2] = Math.random() * SPREAD - SPREAD / 2;
    speeds[i] = 0.02 + Math.random() * 0.05;
  }
  return { positions, speeds };
}

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

  // Geometry is generated in an effect (not during render) so the impure
  // Math.random() seeding stays out of React's render pass, and seeded once
  // per (mount, count). The geometry attribute reads the ref lazily.
  const buffers = useRef<{ positions: Float32Array; speeds: Float32Array } | null>(null);
  const geometryRef = useRef<THREE.BufferGeometry>(null);

  React.useEffect(() => {
    buffers.current = generateBuffers(count);
    const geo = geometryRef.current;
    if (geo && buffers.current) {
      geo.setAttribute('position', new THREE.BufferAttribute(buffers.current.positions, 3));
    }
  }, [count]);

  // Theme-reactive color (warm/cool accent). Blend c1 and c3 for a mid tint.
  // Reading palette (from useSyncExternalStore) keeps this in the render pass
  // but it is a pure derivation, so it's lint-clean.
  const color = React.useMemo(
    () => palette.c1.clone().lerp(palette.c3, 0.5),
    [palette],
  );

  useFrame((state, delta) => {
    const pts = pointsRef.current;
    const group = groupRef.current;
    const buf = buffers.current;
    if (!pts || !group || !buf) return;

    const pos = pts.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      // gentle upward drift; wrap around when leaving the spread
      pos[i * 3 + 1] += buf.speeds[i] * delta;
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
        <bufferGeometry ref={geometryRef}>
          <bufferAttribute attach="attributes-position" args={[new Float32Array(count * 3), 3]} />
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
