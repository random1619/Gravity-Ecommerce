'use client';

import React, { Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { distortVertexShader } from '@/components/three/shaders/distort.vert';
import { distortFragmentShader } from '@/components/three/shaders/distort.frag';
import { productDistortEnabled, DPR_CAP } from '@/lib/three/constants';
import { useDeviceTier } from '@/hooks/useDeviceTier';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useWebGLSupport } from '@/hooks/useWebGLSupport';

interface ProductDistortProps {
  src: string;
  alt: string;
  className?: string;
}

/**
 * Renders a product image on a GLSL-displaced WebGL plane.
 * Falls back to a plain <img> when: reduced motion, WebGL unsupported, or low/mobile tier.
 * Distortion amplitude is intentionally small so the image stays clearly readable.
 *
 * This uses its own local <Canvas> (not the global one) because the product image
 * lives at a specific DOM position and size — the global canvas is fullscreen.
 */
export default function ProductDistort({ src, alt, className }: ProductDistortProps) {
  const reduced = useReducedMotion();
  const supported = useWebGLSupport();
  const tier = useDeviceTier();

  if (reduced || !supported || !productDistortEnabled(tier)) {
    return <img src={src} alt={alt} className={className} />;
  }

  return (
    <div className={className} style={{ width: '100%', height: '100%' }}>
      <Canvas
        dpr={[1, DPR_CAP[tier]]}
        gl={{ alpha: true, antialias: true }}
        camera={{ position: [0, 0, 2], fov: 50 }}
        style={{ width: '100%', height: '100%' }}
      >
        <Suspense fallback={null}>
          <DistortPlane src={src} />
        </Suspense>
      </Canvas>
      {/* screen-reader accessible label since the canvas is non-decorative */}
      <span className="sr-only">{alt}</span>
    </div>
  );
}

/** Inner R3F component — uses drei's useTexture for clean suspend behavior. */
function DistortPlane({ src }: { src: string }) {
  const texture = useTexture(src);
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const pointer = useRef(new THREE.Vector2(0.5, 0.5));

  const uniforms = useMemo(
    () => ({
      uTexture: { value: texture },
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uAmplitude: { value: 0.025 },
    }),
    [texture]
  );

  useFrame((state, delta) => {
    const m = matRef.current;
    if (!m) return;
    m.uniforms.uTime.value += delta;
    const px = state.pointer.x * 0.5 + 0.5;
    const py = state.pointer.y * 0.5 + 0.5;
    pointer.current.lerp(new THREE.Vector2(px, py), 0.08);
    (m.uniforms.uMouse.value as THREE.Vector2).copy(pointer.current);
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={distortVertexShader}
        fragmentShader={distortFragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}
