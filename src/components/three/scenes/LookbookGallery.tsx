'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useThemePalette } from '@/lib/three/themeUniforms';

interface LookbookGalleryProps {
  /** A ref holding 0..1 scroll progress for the lookbook section. */
  progressRef: React.RefObject<number>;
}

/**
 * Subtle decorative ripple plane rendered behind the lookbook section on the
 * global canvas (high/mid tier only — gated by Experience). Reacts to a
 * progress uniform (0..1) driven by the section scroll. Kept very low opacity
 * so it reads as atmosphere, not noise.
 */
export default function LookbookGallery({ progressRef }: LookbookGalleryProps) {
  const palette = useThemePalette();
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uColor: { value: palette.c2.clone() },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useFrame((state, delta) => {
    const m = matRef.current;
    if (!m) return;
    m.uniforms.uTime.value += delta;
    m.uniforms.uProgress.value = progressRef.current ?? 0;
    (m.uniforms.uColor.value as THREE.Color).copy(palette.c2);
  });

  const vertex = /* glsl */ `
    varying vec2 vUv;
    void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }
  `;
  const fragment = /* glsl */ `
    precision mediump float;
    uniform float uTime; uniform float uProgress; uniform vec3 uColor;
    varying vec2 vUv;
    float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
    float noise(vec2 p){ vec2 i=floor(p); vec2 f=fract(p); vec2 u=f*f*(3.0-2.0*f);
      return mix(mix(hash(i),hash(i+vec2(1,0)),u.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y); }
    void main(){
      float n = noise(vUv*4.0 + uTime*0.15 + uProgress*3.0);
      float a = 0.08 * n * (0.5 + uProgress*0.5);
      gl_FragColor = vec4(uColor, a);
    }
  `;

  return (
    <mesh position={[0, 0, -2]}>
      <planeGeometry args={[20, 12]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}
