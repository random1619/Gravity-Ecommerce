'use client';

import React, { Suspense, useEffect, useRef, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import CameraRig from '@/components/three/CameraRig';
import Lighting from '@/components/three/Lighting';
import Effects from '@/components/three/Effects';
import ParticleField from '@/components/three/scenes/ParticleField';
import AuroraShader from '@/components/three/scenes/AuroraShader';

/**
 * Tracks how far the first viewport-height section (hero) has scrolled
 * through the viewport. Returns a 0→1 fade multiplier:
 *   - 1.0 when scrollY ≈ 0 (hero fully visible)
 *   - 0.0 when scrollY ≥ one viewport height past the hero
 * Smoothed via requestAnimationFrame to avoid layout thrashing.
 */
function useHeroFade(): number {
  const [fade, setFade] = useState(1);
  const raf = useRef(0);
  const update = useCallback(() => {
    raf.current = 0;
    const vh = window.innerHeight || 1;
    // Fade over the first viewport of scroll travel (0 → vh)
    const t = Math.min(1, window.scrollY / vh);
    // Ease-out cubic for a natural fade-out feel
    setFade(1 - t * t * t);
  }, []);

  useEffect(() => {
    update();
    const onScroll = () => {
      if (!raf.current) raf.current = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [update]);

  return fade;
}

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
  const heroFade = useHeroFade();
  // Aurora fades as the hero scrolls below the fold; hidden on non-home routes.
  const auroraVisible = isHome ? heroFade : 0;

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
