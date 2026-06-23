'use client';

import React, { Suspense, useEffect, useRef, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import CameraRig from '@/components/three/CameraRig';
import Lighting from '@/components/three/Lighting';
import Effects from '@/components/three/Effects';
import ParticleField from '@/components/three/scenes/ParticleField';
import AuroraShader from '@/components/three/scenes/AuroraShader';
import LookbookGallery from '@/components/three/scenes/LookbookGallery';
import { useDeviceTier } from '@/hooks/useDeviceTier';
import { lookbookR3FEnabled } from '@/lib/three/constants';

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
 * Tracks the scroll progress (0→1) of the lookbook horizontal-pin section by
 * measuring the element carrying `data-lookbook-story`. Writes into a ref
 * (not state) because the value is consumed inside the R3F render loop where
 * re-renders are undesirable — LookbookGallery reads it each frame.
 *
 * Returns false while there's no section to track so the caller can skip
 * mounting the gallery on non-lookbook routes.
 */
function useLookbookProgress(progressRef: React.RefObject<number>): boolean {
  const [active, setActive] = useState(false);
  const raf = useRef(0);

  useEffect(() => {
    const el = document.querySelector('[data-lookbook-story]') as HTMLElement | null;
    if (!el) {
      progressRef.current = 0;
      setActive(false);
      return;
    }
    setActive(true);

    const update = () => {
      raf.current = 0;
      const rect = el.getBoundingClientRect();
      const traveled = window.innerHeight - rect.top;
      const span = window.innerHeight + rect.height;
      progressRef.current = span > 0 ? Math.min(1, Math.max(0, traveled / span)) : 0;
    };
    const onScroll = () => {
      if (!raf.current) raf.current = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf.current) cancelAnimationFrame(raf.current);
      setActive(false);
    };
  }, [progressRef]);

  return active;
}

/**
 * Route-aware scene router. Runs inside the single global <WebGLCanvas>.
 * Decides which sub-scenes render based on the current pathname and device tier.
 *
 * - ParticleField renders everywhere (ambient).
 * - AuroraShader renders on the home route and fades as the hero leaves view.
 * - LookbookGallery renders on /lookbook for high/mid tiers (decorative ripple).
 */
export default function Experience() {
  const pathname = usePathname();
  const tier = useDeviceTier();
  const isHome = pathname === '/';
  const isLookbook = pathname === '/lookbook';
  const heroFade = useHeroFade();
  const lookbookProgress = useRef(0);
  const lookbookActive = useLookbookProgress(lookbookProgress);

  // Aurora fades as the hero scrolls below the fold; hidden on non-home routes.
  const auroraVisible = isHome ? heroFade : 0;
  // Lookbook ripple: only when the section exists AND the tier allows it.
  const showLookbook = isLookbook && lookbookActive && lookbookR3FEnabled(tier);

  return (
    <>
      <CameraRig />
      <Lighting />
      <Suspense fallback={null}>
        <ParticleField />
        {isHome && <AuroraShader visible={auroraVisible} />}
        {showLookbook && <LookbookGallery progressRef={lookbookProgress} />}
      </Suspense>
      <Effects />
    </>
  );
}
