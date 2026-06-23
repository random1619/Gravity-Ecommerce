export type DeviceTier = 'high' | 'mid' | 'low' | 'mobile';

export interface TierSignals {
  hardwareConcurrency: number;
  deviceMemory: number;      // 0 if unsupported
  devicePixelRatio: number;
  effectiveType: string;     // '' if unsupported
  coarsePointer: boolean;
  screenWidth: number;
}

/**
 * Reads device capability signals. Pure — given signals, returns a tier.
 * Evaluated top-down; first match wins. Unknown signals are treated as
 * NOT matching that clause (never as matching it).
 */
export function computeTier(s: TierSignals): DeviceTier {
  // mobile: touch / slow connection / narrow screen
  if (
    s.coarsePointer ||
    ['slow-2g', '2g', '3g'].includes(s.effectiveType) ||
    s.screenWidth < 640
  ) {
    return 'mobile';
  }
  // low: weak CPU / memory / very high-density screen (cheap GPU fill)
  if (
    s.hardwareConcurrency <= 4 ||
    (s.deviceMemory > 0 && s.deviceMemory <= 4) ||
    s.devicePixelRatio >= 3
  ) {
    return 'low';
  }
  // mid: mid-range CPU
  if (s.hardwareConcurrency <= 8) {
    return 'mid';
  }
  return 'high';
}

/** Reads live signals from the browser. Call client-side only. */
export function readTierSignals(): TierSignals {
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { effectiveType?: string };
  };
  return {
    hardwareConcurrency: nav.hardwareConcurrency || 0,
    deviceMemory: nav.deviceMemory ?? 0,
    devicePixelRatio: window.devicePixelRatio || 1,
    effectiveType: nav.connection?.effectiveType ?? '',
    coarsePointer: window.matchMedia('(pointer: coarse)').matches,
    screenWidth: window.innerWidth,
  };
}
