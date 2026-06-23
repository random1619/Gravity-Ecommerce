'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface SplitTextRevealProps {
  text: string;
  className?: string;
  delay?: number;
}

export default function SplitTextReveal({ text, className = '', delay = 0 }: SplitTextRevealProps) {
  const reduced = useReducedMotion();

  // Reduced motion: plain text, no staggered animation.
  if (reduced) {
    return <span className={className}>{text}</span>;
  }

  const words = text.split(' ');
  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.06, delayChildren: delay } },
  };
  const wordVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.03 } },
  };
  const charVariants = {
    hidden: { y: '105%' },
    visible: { y: 0, transition: { type: 'spring' as const, stiffness: 220, damping: 18 } },
  };

  return (
    <motion.span
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className={`inline-flex flex-wrap ${className}`}
      style={{ display: 'inline-flex', overflow: 'hidden' }}
    >
      {words.map((word, wordIndex) => (
        <motion.span
          key={wordIndex}
          variants={wordVariants}
          className="inline-flex mr-[0.25em]"
          style={{ display: 'inline-flex', overflow: 'hidden' }}
        >
          {word.split('').map((char, charIndex) => (
            <motion.span
              key={charIndex}
              variants={charVariants}
              className="inline-block"
              style={{ display: 'inline-block' }}
            >
              {char}
            </motion.span>
          ))}
        </motion.span>
      ))}
    </motion.span>
  );
}
