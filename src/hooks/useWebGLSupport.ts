'use client';

import { useEffect, useState } from 'react';

/**
 * Detects whether a WebGL2 (preferred) or WebGL1 context can be created.
 * SSR-safe. Used to gate the entire WebGL canvas behind a fallback.
 */
export function useWebGLSupport(): boolean {
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    setSupported(detectWebGL());
  }, []);

  return supported;
}

function detectWebGL(): boolean {
  if (typeof window === 'undefined') return false;
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
