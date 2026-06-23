'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { computeTier, readTierSignals, type DeviceTier } from '@/lib/performance/tier';

interface TierContextValue {
  tier: DeviceTier;
  setTier: (t: DeviceTier) => void;
}

const TierContext = createContext<TierContextValue | undefined>(undefined);

export function DeviceTierProvider({ children }: { children: React.ReactNode }) {
  const [tier, setTier] = useState<DeviceTier>('mid');
  const setRef = useRef(setTier);

  useEffect(() => {
    setRef.current(computeTier(readTierSignals()));
  }, []);

  return (
    <TierContext.Provider value={{ tier, setTier }}>
      {children}
    </TierContext.Provider>
  );
}

export function useDeviceTier(): DeviceTier {
  const ctx = useContext(TierContext);
  if (!ctx) {
    if (typeof window !== 'undefined') {
      return computeTier(readTierSignals());
    }
    return 'mid';
  }
  return ctx.tier;
}

/** Returns the setter for QA overrides. */
export function useSetDeviceTier() {
  const ctx = useContext(TierContext);
  return ctx?.setTier ?? (() => {});
}
