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
  c1: new THREE.Color('#c85a3c'), // terracotta clay
  c2: new THREE.Color('#b47c3c'), // ochre gold
  c3: new THREE.Color('#485ea6'), // soft navy
};

const DARK: ThemePalette = {
  c1: new THREE.Color('#00e5ff'), // electric cyan
  c2: new THREE.Color('#8b2cff'), // ultraviolet
  c3: new THREE.Color('#ff007f'), // neon pink
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
