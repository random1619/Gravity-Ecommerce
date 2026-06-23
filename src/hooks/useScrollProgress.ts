'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Returns 0..1 representing how far an element has scrolled through the viewport.
 * 0 = element top entering bottom of viewport; 1 = element bottom leaving top.
 */
export function useScrollProgress(ref: React.RefObject<HTMLElement | null>): number {
  const [progress, setProgress] = useState(0);
  const raf = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => {
      raf.current = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const traveled = vh - rect.top;
      const span = vh + rect.height;
      const p = span > 0 ? traveled / span : 0;
      setProgress(Math.min(1, Math.max(0, p)));
    };

    const onScroll = () => {
      if (raf.current) return;
      raf.current = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [ref]);

  return progress;
}
