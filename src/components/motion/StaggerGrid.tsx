'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface StaggerGridProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  /** Max children to animate per batch; the rest render without delay. */
  batchSize?: number;
}

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, scale: 0.92, y: 16 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      // approximates GSAP back.out(1.4)
      type: 'spring',
      stiffness: 260,
      damping: 20,
      mass: 0.6,
    },
  },
};

/**
 * Standard grid-stagger preset: cards fade/scale/rise in with a springy
 * back.out feel, staggered per child. Caps the animated batch so very long
 * grids don't delay items far down the list. Fully disabled under
 * prefers-reduced-motion (children render instantly).
 */
export default function StaggerGrid({ children, className, style, batchSize = 8 }: StaggerGridProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className} style={style}>{children}</div>;
  }

  const items = React.Children.toArray(children);

  return (
    <motion.div
      className={className}
      style={style}
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.1 }}
    >
      {items.map((child, i) =>
        i < batchSize ? (
          <motion.div key={(child as React.ReactElement)?.key ?? i} variants={itemVariants}>
            {child}
          </motion.div>
        ) : (
          // Beyond the batch: render statically (no wrapper animation).
          <React.Fragment key={(child as React.ReactElement)?.key ?? i}>{child}</React.Fragment>
        )
      )}
    </motion.div>
  );
}
