'use client';

import React, { Suspense } from 'react';
import { usePathname } from 'next/navigation';
import CameraRig from '@/components/three/CameraRig';
import Lighting from '@/components/three/Lighting';
import Effects from '@/components/three/Effects';
import ParticleField from '@/components/three/scenes/ParticleField';
import AuroraShader from '@/components/three/scenes/AuroraShader';

/**
 * Route-aware scene router. Runs inside the single global <WebGLCanvas>.
 * Decides which sub-scenes render based on the current pathname.
 *
 * NOTE: ProductDistort (Phase 5) and LookbookGallery (Phase 6) are added here
 * when those phases land. For now: ParticleField (everywhere) + AuroraShader (home).
 */
export default function Experience() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  // Aurora fades as the hero scrolls away; for v1 keep it full-bright on home.
  const auroraVisible = isHome ? 1 : 0;

  return (
    <>
      <CameraRig />
      <Lighting />
      <Suspense fallback={null}>
        <ParticleField />
        {isHome && <AuroraShader visible={auroraVisible} />}
      </Suspense>
      <Effects />
    </>
  );
}
