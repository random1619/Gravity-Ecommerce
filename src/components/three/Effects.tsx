'use client';

import React from 'react';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { useDeviceTier } from '@/hooks/useDeviceTier';
import { effectsEnabled } from '@/lib/three/constants';

/**
 * Subtle bloom + vignette. Enabled only on the 'high' tier to protect perf.
 * Kept intentionally restrained (no chromatic aberration / DOF) for a premium,
 * minimal look rather than a flashy one.
 */
export default function Effects() {
  const tier = useDeviceTier();
  if (!effectsEnabled(tier)) return null;

  return (
    <EffectComposer multisampling={0}>
      <Bloom intensity={0.25} luminanceThreshold={0.6} luminanceSmoothing={0.4} mipmapBlur />
      <Vignette eskil={false} offset={0.3} darkness={0.5} />
    </EffectComposer>
  );
}
