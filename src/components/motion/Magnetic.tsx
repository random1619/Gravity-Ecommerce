'use client';

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface MagneticProps {
  children: React.ReactElement;
  range?: number;
  strength?: number;
}

export default function Magnetic({ children, range = 50, strength = 0.3 }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const reduced = useReducedMotion();

  // Reduced motion OR touch: passthrough, no magnetic effect.
  if (reduced) {
    return <span style={{ display: 'inline-block' }}>{children}</span>;
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
    <div ref={ref} onMouseMove={handleMouseMove} onMouseLeave={() => setPosition({ x: 0, y: 0 })} style={{ display: 'inline-block' }}>
      <motion.div animate={{ x: position.x, y: position.y }} transition={{ type: 'spring', stiffness: 180, damping: 18, mass: 0.2 }}>
        {children}
      </motion.div>
    </div>
  );
}
