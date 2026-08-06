'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface ParallaxProps {
  children: React.ReactNode;
  /** Pixels of vertical drift across the scroll pass. Negative = slower than scroll (recedes), positive = faster. */
  offset?: number;
  className?: string;
}

/**
 * Scroll-linked parallax wrapper. The element drifts by `offset` px as it
 * traverses the viewport, giving sections a sense of depth relative to
 * each other. Renders statically under prefers-reduced-motion.
 */
export default function Parallax({ children, offset = 40, className }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  // Reduced motion: map scroll to a constant 0 drift. We still render the
  // same motion.div with the ref attached — conditionally swapping element
  // types would leave useScroll with a target ref that never mounts, which
  // trips motion's "defined but not hydrated" invariant.
  const drift = reduced ? 0 : offset;
  const y: MotionValue<number> = useTransform(scrollYProgress, [0, 1], [drift, -drift]);

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}
