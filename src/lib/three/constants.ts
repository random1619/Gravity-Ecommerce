import type { DeviceTier } from '@/lib/performance/tier';

/** DPR cap per tier. Actual DPR = min(window.devicePixelRatio, cap). */
export const DPR_CAP: Record<DeviceTier, number> = {
  high: 1.5,
  mid: 1.25,
  low: 1,
  mobile: 1,
};

/** Particle counts for the global ambient ParticleField. */
export const PARTICLE_COUNT: Record<DeviceTier, number> = {
  high: 600,
  mid: 350,
  low: 180,
  mobile: 180,
};

/** Aurora shader noise octaves (higher = more detail, more cost). */
export const AURORA_OCTAVES: Record<DeviceTier, number> = {
  high: 5,
  mid: 4,
  low: 3,
  mobile: 3,
};

/** Whether postprocessing effects are enabled at all for a tier. */
export function effectsEnabled(tier: DeviceTier): boolean {
  return tier === 'high';
}

/** Whether the lookbook R3F plane layer should render (vs pure GSAP). */
export function lookbookR3FEnabled(tier: DeviceTier): boolean {
  return tier === 'high' || tier === 'mid';
}
