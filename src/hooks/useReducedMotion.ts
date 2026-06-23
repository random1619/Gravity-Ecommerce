'use client';

import { useSyncExternalStore } from 'react';

const REDUCED_QUERY = '(prefers-reduced-motion: reduce)';

function subscribe(callback: () => void): () => void {
  const mq = window.matchMedia(REDUCED_QUERY);
  mq.addEventListener('change', callback);
  return () => mq.removeEventListener('change', callback);
}

function getSnapshot(): boolean {
  return window.matchMedia(REDUCED_QUERY).matches;
}

function getServerSnapshot(): boolean {
  return false;
}

/**
 * Single source of truth for prefers-reduced-motion across the app.
 * SSR-safe: returns false during SSR and on first client paint, then updates.
 * Closes the gap where none of the project's JS motion honored this preference.
 *
 * Implemented with useSyncExternalStore so there's no setState-in-effect and
 * React guarantees the snapshot stays consistent during concurrent rendering.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** Static check (no React). For use outside hooks / in libs. */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia(REDUCED_QUERY).matches;
}
