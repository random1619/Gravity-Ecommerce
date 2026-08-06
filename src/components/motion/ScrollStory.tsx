'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface ScrollStoryProps {
  /** The horizontal track of panels. */
  children: React.ReactNode;
  /** Class on the outer (pinned) container. */
  className?: string;
  /** Class on the inner horizontal track. */
  trackClassName?: string;
  /** Fires with scroll progress 0→1 while the section is pinned (GSAP onUpdate). */
  onProgress?: (progress: number) => void;
}

/**
 * Reusable GSAP horizontal-pin scroll-story: the section pins while vertical
 * scroll drives a horizontal translate of the inner track.
 *
 * Under reduced motion, renders as a normal vertical stack (no pinning) so the
 * content is fully accessible without any horizontal scroll.
 *
 * Integrates with Lenis via ScrollTrigger's scrollerProxy-free default (Lenis
 * already drives window scroll, which ScrollTrigger listens to).
 */
export default function ScrollStory({ children, className, trackClassName, onProgress }: ScrollStoryProps) {
  const outerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  // Keep the latest callback without re-running the GSAP effect
  const onProgressRef = useRef(onProgress);
  onProgressRef.current = onProgress;

  useEffect(() => {
    if (reduced) return;
    gsap.registerPlugin(ScrollTrigger);

    const outer = outerRef.current;
    const track = trackRef.current;
    if (!outer || !track) return;

    const getDistance = () => track.scrollWidth - window.innerWidth;

    const ctx = gsap.context(() => {
      const tween = gsap.to(track, {
        x: () => -getDistance(),
        ease: 'none',
        scrollTrigger: {
          trigger: outer,
          start: 'top top',
          end: () => `+=${getDistance()}`,
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => onProgressRef.current?.(self.progress),
        },
      });
      return () => {
        tween.kill();
      };
    }, outerRef);

    return () => ctx.revert();
  }, [reduced]);

  // Reduced motion: simple vertical stack of the panels.
  if (reduced) {
    return (
      <div ref={outerRef} className={className}>
        <div ref={trackRef} className={trackClassName} style={{ display: 'flex', flexDirection: 'column' }}>
          {children}
        </div>
      </div>
    );
  }

  return (
    <div ref={outerRef} className={className} style={{ overflow: 'hidden' }}>
      <div ref={trackRef} className={trackClassName} style={{ display: 'flex', willChange: 'transform' }}>
        {children}
      </div>
    </div>
  );
}
