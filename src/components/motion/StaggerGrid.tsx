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
  /**
   * Class applied to each item wrapper (the actual grid/flex child). Lets the
   * parent's grid span and rhythm live on the wrapper instead of the child.
   * Receives the item index so spans/alternation can vary per item.
   */
  itemClassName?: (index: number) => string;
}

/**
 * Kowalski entrance: a slightly bouncier spring (higher stiffness, lower
 * damping) so items accelerate in and settle with a soft overshoot — physics,
 * never a fixed-duration tween. Transform + opacity only (compositor-only).
 */
const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.05,
      // Let the first child start before the stagger clock for a snappier lead.
      delayChildren: 0.04,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, scale: 0.94, y: 20 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 380,
      damping: 24,
      mass: 0.7,
    },
  },
};

/** Spring used when the grid re-flows (filter/sort) — interruptible layout motion. */
const layoutSpring = { type: 'spring', stiffness: 350, damping: 32, mass: 0.8 } as const;

/**
 * Standard grid-stagger preset: cards fade/scale/rise in with a springy
 * back.out feel, staggered per child. Caps the animated batch so very long
 * grids don't delay items far down the list. Fully disabled under
 * prefers-reduced-motion (children render instantly).
 */
export default function StaggerGrid({ children, className, style, batchSize = 8, itemClassName }: StaggerGridProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    if (!itemClassName) {
      return <div className={className} style={style}>{children}</div>;
    }
    // Mirror the wrapper structure so grid spans/rhythm survive reduced motion.
    return (
      <div className={className} style={style}>
        {React.Children.toArray(children).map((child, i) => (
          <div key={(child as React.ReactElement)?.key ?? i} className={itemClassName(i)}>
            {child}
          </div>
        ))}
      </div>
    );
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
          <motion.div
            key={(child as React.ReactElement)?.key ?? i}
            className={itemClassName ? itemClassName(i) : undefined}
            variants={itemVariants}
            layout
            transition={layoutSpring}
          >
            {child}
          </motion.div>
        ) : (
          // Beyond the batch: render statically (no wrapper animation).
          itemClassName ? (
            <div key={(child as React.ReactElement)?.key ?? i} className={itemClassName(i)}>
              {child}
            </div>
          ) : (
            <React.Fragment key={(child as React.ReactElement)?.key ?? i}>{child}</React.Fragment>
          )
        )
      )}
    </motion.div>
  );
}
