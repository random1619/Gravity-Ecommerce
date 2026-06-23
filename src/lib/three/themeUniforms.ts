'use client';

import { useEffect, useState } from 'react';
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

function currentTheme(): ThemeName {
  if (typeof document === 'undefined') return 'light';
  return (document.documentElement.getAttribute('data-theme') as ThemeName) || 'light';
}

function paletteFor(theme: ThemeName): ThemePalette {
  return theme === 'dark' ? DARK : LIGHT;
}

/**
 * React hook returning the current theme palette, updating live when the user
 * toggles theme. Watches the data-theme attribute via MutationObserver.
 */
export function useThemePalette(): ThemePalette {
  const [palette, setPalette] = useState<ThemePalette>(() => paletteFor(currentTheme()));

  useEffect(() => {
    setPalette(paletteFor(currentTheme()));
    const observer = new MutationObserver(() => {
      setPalette(paletteFor(currentTheme()));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
    return () => observer.disconnect();
  }, []);

  return palette;
}
