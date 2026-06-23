'use client';

import { useSyncExternalStore } from 'react';

/**
 * Detects whether a WebGL2 (preferred) or WebGL1 context can be created.
 * SSR-safe. Used to gate the entire WebGL canvas behind a fallback.
 *
 * WebGL capability never changes for a given page load, so there's no
 * subscription — we just cache the result and return it via useSyncExternalStore
 * to avoid setState-in-effect and stay concurrent-safe.
 */
export function useWebGLSupport(): boolean {
  return useSyncExternalStore(subscribeNoop, () => webglSupported, () => false);
}

const subscribeNoop = () => () => {};

let webglSupported = false;
if (typeof window !== 'undefined') {
  webglSupported = detectWebGL();
}

function detectWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      (canvas.getContext('experimental-webgl') as WebGLRenderingContext | null);
    return !!gl && typeof gl.getParameter === 'function';
  } catch {
    return false;
  }
}
