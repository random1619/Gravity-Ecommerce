'use client';

import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import styles from './CustomCursor.module.css';

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [cursorText, setCursorText] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  // Raw mouse coordinates
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Springs for the outer follower circle
  const springConfig = { damping: 28, stiffness: 220, mass: 0.5 };
  const followerX = useSpring(mouseX, springConfig);
  const followerY = useSpring(mouseY, springConfig);

  // Springs for the inner dot
  const dotX = useSpring(mouseX, { damping: 40, stiffness: 450 });
  const dotY = useSpring(mouseY, { damping: 40, stiffness: 450 });

  useEffect(() => {
    const hasMouse = window.matchMedia('(pointer: fine)').matches;
    if (!hasMouse) return;

    setIsVisible(true);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactiveEl = target.closest('a, button, [role="button"], [data-cursor-text]');
      
      if (interactiveEl) {
        setIsHovering(true);
        const text = interactiveEl.getAttribute('data-cursor-text') || '';
        setCursorText(text);
      } else {
        setIsHovering(false);
        setCursorText('');
      }
    };

    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, [mouseX, mouseY]);

  if (!isVisible) return null;

  return (
    <>
      {/* Outer Follower Circle */}
      <motion.div
        className={`${styles.cursorFollower} ${isHovering ? styles.hover : ''} ${cursorText ? styles.hasText : ''}`}
        style={{
          x: followerX,
          y: followerY,
          translateX: -16,
          translateY: -16,
        }}
        animate={{
          scale: cursorText ? 1.75 : (isHovering ? 1.5 : 1),
          backgroundColor: cursorText ? 'rgba(255, 255, 255, 0.15)' : (isHovering ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0)'),
          borderColor: isHovering ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.8)',
        }}
        transition={{ type: 'spring', stiffness: 350, damping: 22 }}
      >
        {cursorText && (
          <motion.span 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.15 }}
            className={styles.cursorLabel}
          >
            {cursorText}
          </motion.span>
        )}
      </motion.div>
      {/* Inner Dot */}
      <motion.div
        className={`${styles.cursorDot} ${isHovering ? styles.hover : ''}`}
        style={{
          x: dotX,
          y: dotY,
          translateX: -4,
          translateY: -4,
        }}
        animate={{
          scale: isHovering ? 0 : 1,
        }}
        transition={{ duration: 0.15 }}
      />
    </>
  );
}
