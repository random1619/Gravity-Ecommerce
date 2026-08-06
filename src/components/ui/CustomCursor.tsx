'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import styles from './CustomCursor.module.css';
import { useReducedMotion } from '@/hooks/useReducedMotion';

type CursorVariant = 'default' | 'hover' | 'text';

export default function CustomCursor() {
  const reduced = useReducedMotion();
  const [variant, setVariant] = useState<CursorVariant>('default');
  const [cursorText, setCursorText] = useState('');
  const [isPressed, setIsPressed] = useState(false);
  // Must start false to match SSR — reading matchMedia in the initializer
  // would render the cursor on the client's first frame but null on the
  // server, causing a hydration mismatch.
  const [isVisible, setIsVisible] = useState(false);

  // Raw mouse coordinates
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Springs for the outer follower ring — soft, trailing feel
  const ringX = useSpring(mouseX, { damping: 30, stiffness: 260, mass: 0.6 });
  const ringY = useSpring(mouseY, { damping: 30, stiffness: 260, mass: 0.6 });

  // The dot tracks nearly 1:1 so it feels crisp and precise.
  const dotX = useSpring(mouseX, { damping: 50, stiffness: 900, mass: 0.2 });
  const dotY = useSpring(mouseY, { damping: 50, stiffness: 900, mass: 0.2 });

  // Track the currently matched interactive element so we only update React
  // state when the hovered target actually changes — not on every mouseover
  // fired while moving across nested children.
  const activeTarget = useRef<Element | null>(null);

  useEffect(() => {
    const hasMouse = window.matchMedia('(pointer: fine)').matches;
    if (!hasMouse) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      // Reveal on first movement (not on mount) so the ring never flashes at
      // the top-left corner while the pointer hasn't moved yet.
      setIsVisible(true);
    };

    // mouseout with a null relatedTarget = the pointer left the window
    // entirely. document-level 'mouseleave' does not fire reliably here.
    const handleMouseOut = (e: MouseEvent) => {
      if (!e.relatedTarget) setIsVisible(false);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactiveEl = target.closest(
        'a, button, [role="button"], input, select, textarea, label, [data-cursor-text]'
      );

      if (interactiveEl === activeTarget.current) return;
      activeTarget.current = interactiveEl;

      if (interactiveEl) {
        const text = interactiveEl.getAttribute('data-cursor-text') || '';
        if (text) {
          setVariant('text');
          setCursorText(text);
        } else {
          setVariant('hover');
          setCursorText('');
        }
      } else {
        setVariant('default');
        setCursorText('');
      }
    };

    // If the hovered element unmounts (route change, cart close, etc.) the
    // next mouseover may never fire — clear the stuck state on mouseout of
    // the active target.
    const clearIfLeavingActive = (e: MouseEvent) => {
      if (
        activeTarget.current &&
        e.relatedTarget instanceof Node &&
        !activeTarget.current.contains(e.relatedTarget)
      ) {
        activeTarget.current = null;
        setVariant('default');
        setCursorText('');
      }
    };

    const handleDown = () => setIsPressed(true);
    const handleUp = () => setIsPressed(false);
    const handleBlur = () => {
      setIsVisible(false);
      setIsPressed(false);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseout', handleMouseOut);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', clearIfLeavingActive);
    window.addEventListener('mousedown', handleDown);
    window.addEventListener('mouseup', handleUp);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseout', handleMouseOut);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', clearIfLeavingActive);
      window.removeEventListener('mousedown', handleDown);
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, [mouseX, mouseY]);

  // Signal to the stylesheet that the custom cursor is live so it can hide the
  // native one. Gated on visibility + a fine pointer so the native cursor is
  // never hidden while nothing is being rendered in its place.
  const active = isVisible && !reduced;
  useEffect(() => {
    document.body.classList.toggle('custom-cursor-active', active);
    return () => document.body.classList.remove('custom-cursor-active');
  }, [active]);

  // Under reduced motion, render nothing — the native cursor remains and no
  // spring-animated follower trails the pointer.
  if (!active) return null;

  const isText = variant === 'text';
  const isHover = variant === 'hover';

  return (
    <>
      {/* Outer follower ring */}
      <motion.div
        className={`${styles.cursorRing} ${isText ? styles.hasText : ''}`}
        style={{ x: ringX, y: ringY }}
        animate={{
          width: isText ? 72 : isHover ? 52 : 32,
          height: isText ? 72 : isHover ? 52 : 32,
          scale: isPressed ? 0.85 : 1,
          opacity: 1,
        }}
        transition={{ type: 'spring', stiffness: 380, damping: 26 }}
      >
        {isText && (
          <motion.span
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            className={styles.cursorLabel}
          >
            {cursorText}
          </motion.span>
        )}
      </motion.div>

      {/* Inner dot — hidden while a text label is showing */}
      <motion.div
        className={styles.cursorDot}
        style={{ x: dotX, y: dotY }}
        animate={{
          scale: isText ? 0 : isHover ? 0.5 : isPressed ? 1.6 : 1,
          opacity: isText ? 0 : 1,
        }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
      />
    </>
  );
}
