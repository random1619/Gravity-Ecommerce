'use client';

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface MagneticProps {
  children: React.ReactElement;
  /** Interaction radius (px) within which the child pulls toward the cursor. */
  range?: number;
  /** How strongly the child follows the cursor (0–1). */
  strength?: number;
  /**
   * Applied to the wrapper in both the motion and reduced-motion branches.
   * Pass a block-width class for full-width CTAs (the default is inline-block,
   * which shrinks to content).
   */
  className?: string;
}

export default function Magnetic({ children, range = 50, strength = 0.3, className }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const reduced = useReducedMotion();

  // Reduced motion OR touch: passthrough, no magnetic effect. Still honors
  // className so full-width CTAs keep their layout with motion disabled.
  if (reduced) {
    return <span className={className} style={className ? undefined : { display: 'inline-block' }}>{children}</span>;
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const distance = Math.hypot(clientX - centerX, clientY - centerY);
    if (distance < range) {
      setPosition({ x: (clientX - centerX) * strength, y: (clientY - centerY) * strength });
    } else {
      setPosition({ x: 0, y: 0 });
    }
  };

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setPosition({ x: 0, y: 0 })}
      style={className ? undefined : { display: 'inline-block' }}
    >
      <motion.div animate={{ x: position.x, y: position.y }} transition={{ type: 'spring', stiffness: 180, damping: 18, mass: 0.2 }}>
        {children}
      </motion.div>
    </div>
  );
}
