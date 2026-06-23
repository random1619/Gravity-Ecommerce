'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Canvas } from '@react-three/fiber';
import { useDeviceTier } from '@/hooks/useDeviceTier';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useWebGLSupport } from '@/hooks/useWebGLSupport';
import { DPR_CAP } from '@/lib/three/constants';

// Experience is dynamically imported so the entire WebGL scene graph (and
// transitively three/drei/postprocessing) is excluded from the initial bundle
// of routes that never need it (cart/checkout/account etc. still load the
// fallback only, and the chunk is fetched only when this component mounts).
const Experience = dynamic(() => import('@/components/three/Experience'), {
  ssr: false,
  loading: () => null,
});

/**
 * The single global WebGL canvas. Fixed behind all content, pointer-events none.
 * Renders the gradient fallback div when: reduced motion, or WebGL unsupported.
 */
export default function WebGLCanvas() {
  const reduced = useReducedMotion();
  const supported = useWebGLSupport();
  const tier = useDeviceTier();

  if (reduced || !supported) {
    return <div aria-hidden style={fallbackStyle} />;
  }

  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        pointerEvents: 'none',
      }}
    >
      <Canvas
        dpr={[1, DPR_CAP[tier]]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0, 5], fov: 60 }}
        frameloop="always"
      >
        <Experience />
      </Canvas>
    </div>
  );
}

const fallbackStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  zIndex: -1,
  pointerEvents: 'none',
  // Reuse the body ambient gradient feel (defined in globals.css page-gradient).
  background:
    'radial-gradient(1200px 600px at 10% -10%, var(--ambient-1), transparent 60%),' +
    'radial-gradient(900px 500px at 90% 0%, var(--ambient-2), transparent 55%)',
};
