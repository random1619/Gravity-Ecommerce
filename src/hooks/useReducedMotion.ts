'use client';

import { useEffect, useState } from 'react';

/**
 * Single source of truth for prefers-reduced-motion across the app.
 * SSR-safe: returns false during SSR and on first client paint, then updates.
 * Closes the gap where none of the project's JS motion honored this preference.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);

    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return reduced;
}

/** Static check (no React). For use outside hooks / in libs. */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
