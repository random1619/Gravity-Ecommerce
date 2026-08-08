'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import styles from './CustomCursor.module.css';

type CursorVariant = 'default' | 'hover' | 'text' | 'drag';

export default function CustomCursor() {
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

  // Springs for the outer follower ring — soft, trailing feel. A slightly
  // under-damped spring reads as "alive" rather than laggy; the handoff
  // between the trailing ring and the crisp dot is where the depth comes from.
  const ringX = useSpring(mouseX, { damping: 24, stiffness: 280, mass: 0.55 });
  const ringY = useSpring(mouseY, { damping: 24, stiffness: 280, mass: 0.55 });

  // The dot tracks nearly 1:1 so it feels crisp and precise.
  const dotX = useSpring(mouseX, { damping: 50, stiffness: 900, mass: 0.2 });
  const dotY = useSpring(mouseY, { damping: 50, stiffness: 900, mass: 0.2 });

  // Spring-driven ring size so hover/text transitions animate through the
  // same physical motion as position — one spring system, no hard swaps.
  const ringSize = useSpring(32, { damping: 28, stiffness: 340, mass: 0.5 });

  // Track the currently matched interactive element so we only update React
  // state when the hovered target actually changes — not on every mouseover
  // fired while moving across nested children.
  const activeTarget = useRef<Element | null>(null);

  useEffect(() => {
    const hasMouse = window.matchMedia('(pointer: fine)').matches;
    // iPads with a trackpad report a fine pointer but the custom cursor fights
    // the OS-managed one — bail and let the native cursor win.
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (!hasMouse || isIOS) return;

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
        'a, button, [role="button"], input, select, textarea, label, [data-cursor-text], [data-cursor="drag"]'
      );

      if (interactiveEl === activeTarget.current) return;
      activeTarget.current = interactiveEl;

      if (interactiveEl) {
        const text = interactiveEl.getAttribute('data-cursor-text') || '';
        const isDrag = interactiveEl.getAttribute('data-cursor') === 'drag';
        if (isDrag) {
          setVariant('drag');
          setCursorText(text || 'Drag');
        } else if (text) {
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

    // Press feedback fires on pointer-down, not release — the cursor should
    // feel like it heard the click the instant the finger lands.
    const handleDown = () => setIsPressed(true);
    const handleUp = () => setIsPressed(false);
    const handleBlur = () => {
      setIsVisible(false);
      setIsPressed(false);
    };

    // While a draggable (e.g. the hero slider) is mid-gesture, collapse the
    // ring into the dot so the cursor becomes a precise grab point.
    const handleDragStart = () => {
      if (activeTarget.current?.getAttribute('data-cursor') === 'drag' || document.body.hasAttribute('data-dragging')) {
        setVariant((v) => (v === 'default' ? 'hover' : v));
        setIsPressed(true);
      }
    };
    const handleDragEnd = () => setIsPressed(false);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseout', handleMouseOut);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', clearIfLeavingActive);
    window.addEventListener('mousedown', handleDown);
    window.addEventListener('mouseup', handleUp);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('dragend', handleDragEnd);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseout', handleMouseOut);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', clearIfLeavingActive);
      window.removeEventListener('mousedown', handleDown);
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('dragend', handleDragEnd);
    };
  }, [mouseX, mouseY]);

  // Signal to the stylesheet that the custom cursor is live so it can hide the
  // native one. Gated on visibility so the native cursor is never hidden
  // while nothing is being rendered in its place.
  const active = isVisible;
  useEffect(() => {
    document.body.classList.toggle('custom-cursor-active', active);
    return () => document.body.classList.remove('custom-cursor-active');
  }, [active]);

  const isText = variant === 'text';
  const isDrag = variant === 'drag';
  const isHover = variant === 'hover';
  const hasLabel = isText || isDrag;
  const targetSize = isDrag ? 56 : isText ? 72 : isHover ? 52 : 32;

  // Drive the spring toward the new size so growth/shrink shares the same
  // physical motion as position (one spring system end to end). This hook
  // must live above the early return below — a hook after a conditional
  // return crashes the component with "Rendered more hooks" the moment
  // `active` flips true on the first mousemove.
  useEffect(() => {
    ringSize.set(targetSize);
  }, [targetSize, ringSize]);

  // Render nothing until the pointer has moved (active) — the cursor never
  // flashes at the top-left corner before the first mousemove.
  if (!active) return null;

  return (
    <>
      {/* Outer follower ring */}
      <motion.div
        className={`${styles.cursorRing} ${hasLabel ? styles.hasText : ''}`}
        style={{ x: ringX, y: ringY, width: ringSize, height: ringSize }}
        animate={{
          scale: isPressed ? 0.88 : 1,
          opacity: 1,
        }}
        transition={{ type: 'spring', stiffness: 420, damping: 24 }}
      >
        {hasLabel && (
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

      {/* Inner dot — hidden while a label is showing. Pressed grows the dot
          so a click reads as an affirmative "heard it," not a shrink. */}
      <motion.div
        className={styles.cursorDot}
        style={{ x: dotX, y: dotY }}
        animate={{
          scale: hasLabel ? 0 : isPressed ? 1.5 : isHover ? 0.5 : 1,
          opacity: hasLabel ? 0 : 1,
        }}
        transition={{ type: 'spring', stiffness: 520, damping: 26 }}
      />
    </>
  );
}
