'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { auroraVertexShader } from '@/components/three/shaders/aurora.vert';
import { auroraFragmentShader } from '@/components/three/shaders/aurora.frag';
import { useThemePalette } from '@/lib/three/themeUniforms';
import { AURORA_OCTAVES } from '@/lib/three/constants';
import { useDeviceTier } from '@/hooks/useDeviceTier';

interface AuroraShaderProps {
  /** 0..1 visibility — used to fade the aurora in/out as the hero scrolls away. */
  visible?: number;
}

/**
 * Full-viewport shader plane that renders a flowing, theme-colored aurora
 * behind the home hero. Mouse-reactive UV offset. Only renders on home.
 */
export default function AuroraShader({ visible = 1 }: AuroraShaderProps) {
  const { viewport } = useThree();
  const tier = useDeviceTier();
  const palette = useThemePalette();
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const pointer = useRef(new THREE.Vector2(0.5, 0.5));

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uColor1: { value: palette.c1.clone() },
      uColor2: { value: palette.c2.clone() },
      uColor3: { value: palette.c3.clone() },
      uIntensity: { value: 0.5 },
      uOctaves: { value: AURORA_OCTAVES[tier] },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // Keep uniform colors in sync with theme + visibility each frame.
  useFrame((state, delta) => {
    const m = matRef.current;
    if (!m) return;
    m.uniforms.uTime.value += delta;
    // ease pointer toward actual mouse
    const px = state.pointer.x * 0.5 + 0.5;
    const py = state.pointer.y * 0.5 + 0.5;
    pointer.current.lerp(new THREE.Vector2(px, py), 0.05);
    (m.uniforms.uMouse.value as THREE.Vector2).copy(pointer.current);
    // fade intensity as hero scrolls away
    m.uniforms.uIntensity.value = 0.5 * visible;
    // theme color sync (cheap — three vec copies)
    (m.uniforms.uColor1.value as THREE.Color).copy(palette.c1);
    (m.uniforms.uColor2.value as THREE.Color).copy(palette.c2);
    (m.uniforms.uColor3.value as THREE.Color).copy(palette.c3);
    m.uniforms.uOctaves.value = AURORA_OCTAVES[tier];
  });

  return (
    <mesh position={[0, 0, -1]}>
      {/* scale plane to fill viewport with margin */}
      <planeGeometry args={[viewport.width * 2, viewport.height * 2]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={auroraVertexShader}
        fragmentShader={auroraFragmentShader}
        uniforms={uniforms}
        depthWrite={false}
      />
    </mesh>
  );
}
