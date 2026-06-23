'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface GSAPParallaxProps {
  children: React.ReactNode;
  speed?: number;
}

export default function GSAPParallax({ children, speed = 0.12 }: GSAPParallaxProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return; // no parallax under reduced motion
    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    const target = targetRef.current;
    if (!container || !target) return;

    const yVal = container.offsetHeight * speed;
    const anim = gsap.fromTo(
      target,
      { y: -yVal },
      { y: yVal, ease: 'none', scrollTrigger: { trigger: container, start: 'top bottom', end: 'bottom top', scrub: true } }
    );
    return () => {
      anim.kill();
    };
  }, [speed, reduced]);

  // Reduced motion: render children directly, no wrapper transform.
  if (reduced) {
    return <>{children}</>;
  }

  return (
    <div ref={containerRef} style={{ overflow: 'hidden', position: 'relative', width: '100%', height: '100%' }}>
      <div ref={targetRef} style={{ width: '100%', height: '120%', position: 'absolute', top: '-10%', left: 0 }}>
        {children}
      </div>
    </div>
  );
}
