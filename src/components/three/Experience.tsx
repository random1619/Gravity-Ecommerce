'use client';

import React, { Suspense, useEffect, useRef, useSyncExternalStore } from 'react';
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
 * Subscribe to window scroll/resize via a single shared rAF-coalesced store.
 * Returns a monotonically increasing "tick" so React knows to re-read snapshot
 * getters that depend on layout. Avoids setState-in-effect entirely.
 */
const NOOP = () => () => {};
function subscribeScroll(callback: () => void): () => void {
  let scheduled = false;
  const schedule = () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      callback();
    });
  };
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  return () => {
    window.removeEventListener('scroll', schedule);
    window.removeEventListener('resize', schedule);
  };
}

/**
 * Tracks how far the first viewport-height section (hero) has scrolled
 * through the viewport. Returns a 0→1 fade multiplier:
 *   - 1.0 when scrollY ≈ 0 (hero fully visible)
 *   - 0.0 when scrollY ≥ one viewport height past the hero
 * Ease-out cubic for a natural fade-out feel.
 */
function useHeroFade(): number {
  return useSyncExternalStore(
    subscribeScroll,
    () => {
      const vh = window.innerHeight || 1;
      const t = Math.min(1, window.scrollY / vh);
      return 1 - t * t * t;
    },
    () => 1,
  );
}

/**
 * Tracks the scroll progress (0→1) of the lookbook horizontal-pin section by
 * measuring the element carrying `data-lookbook-story`.
 *
 * Returns `{ active, progress }` where `active` is whether the section exists
 * (so the caller can skip mounting the gallery on non-lookbook routes) and
 * `progress` is the latest 0..1 value (read live by the R3F render loop).
 */
function useLookbookProgress(progressRef: React.RefObject<number>): boolean {
  // active is stable for the lifetime of the DOM, so it does not need scroll
  // reactivity — read it once on mount via an effect-free lazy check.
  const active = useSyncExternalStore(
    NOOP,
    () => !!document.querySelector('[data-lookbook-story]'),
    () => false,
  );

  useEffect(() => {
    if (!active) {
      progressRef.current = 0;
      return;
    }
    const el = document.querySelector('[data-lookbook-story]') as HTMLElement | null;
    if (!el) return;
    // Keep the ref fresh on scroll/resize so the R3F frame loop reads it.
    const update = () => {
      const rect = el.getBoundingClientRect();
      const traveled = window.innerHeight - rect.top;
      const span = window.innerHeight + rect.height;
      progressRef.current = span > 0 ? Math.min(1, Math.max(0, traveled / span)) : 0;
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [active, progressRef]);

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
