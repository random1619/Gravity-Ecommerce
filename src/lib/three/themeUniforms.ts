'use client';

import { useSyncExternalStore } from 'react';
import * as THREE from 'three';

type ThemeName = 'light' | 'dark';

export interface ThemePalette {
  c1: THREE.Color;
  c2: THREE.Color;
  c3: THREE.Color;
}

const LIGHT: ThemePalette = {
  c1: new THREE.Color('#3f6b5c'), // deep sage (protagonist)
  c2: new THREE.Color('#5d7a6d'), // muted sage
  c3: new THREE.Color('#7e988c'), // pale sage
};

const DARK: ThemePalette = {
  c1: new THREE.Color('#7fa396'), // luminous sage (protagonist)
  c2: new THREE.Color('#57705f'), // deep sage
  c3: new THREE.Color('#93b3a7'), // pale sage-glow
};

/** Frozen palette table keyed by theme name. */
const PALETTES: Record<ThemeName, ThemePalette> = { light: LIGHT, dark: DARK };

function currentTheme(): ThemeName {
  if (typeof document === 'undefined') return 'light';
  return (document.documentElement.getAttribute('data-theme') as ThemeName) || 'light';
}

/**
 * React hook returning the current theme palette, updating live when the user
 * toggles theme. Watches the data-theme attribute via useSyncExternalStore +
 * MutationObserver — no setState-in-effect, concurrent-safe. Returns a stable
 * reference per theme so consumers' memo deps stay clean across re-renders.
 */
export function useThemePalette(): ThemePalette {
  const theme = useThemeName();
  return PALETTES[theme];
}

/** Returns the live theme name ('light' | 'dark'), subscribing to data-theme. */
function useThemeName(): ThemeName {
  return useSyncExternalStore(subscribeTheme, currentTheme, () => 'light' as ThemeName);
}

function subscribeTheme(callback: () => void): () => void {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });
  return () => observer.disconnect();
}
