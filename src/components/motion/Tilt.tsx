'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface TiltProps {
    children: React.ReactNode;
    /** Max rotation in degrees at the card edge. Keep small — 3 to 7 reads premium, more reads gimmicky. */
    max?: number;
    /** Hover lift scale. Default 1 (no lift — pair with CSS hover shadows instead). */
    scale?: number;
    className?: string;
}

/**
 * Pointer-tracked 3D tilt, Emil Kowalski style: raw pointer position feeds
 * motion values, springs (not durations) chase them, so the card accelerates
 * and settles like a physical object and is interruptible mid-flight.
 *
 * Always renders the same element type — tilt is enabled post-mount only when
 * the pointer is fine (mouse/trackpad) and motion is allowed — so children
 * are never remounted and SSR markup never mismatches.
 */
export default function Tilt({ children, max = 6, scale = 1, className }: TiltProps) {
    const reduced = useReducedMotion();
    const ref = useRef<HTMLDivElement>(null);
    const [finePointer, setFinePointer] = useState(false);

    useEffect(() => {
        setFinePointer(window.matchMedia('(pointer: fine)').matches);
    }, []);

    const active = finePointer && !reduced;

    const px = useMotionValue(0);
    const py = useMotionValue(0);
    const sx = useSpring(px, { stiffness: 260, damping: 22, mass: 0.6 });
    const sy = useSpring(py, { stiffness: 260, damping: 22, mass: 0.6 });
    const rotateX = useTransform(sy, [-0.5, 0.5], [max, -max]);
    const rotateY = useTransform(sx, [-0.5, 0.5], [-max, max]);

    return (
        <motion.div
            ref={ref}
            className={className}
            style={
                active
                    ? { rotateX, rotateY, transformPerspective: 900, willChange: 'transform' }
                    : undefined
            }
            onPointerMove={
                active
                    ? (e) => {
                          const r = ref.current?.getBoundingClientRect();
                          if (!r) return;
                          px.set((e.clientX - r.left) / r.width - 0.5);
                          py.set((e.clientY - r.top) / r.height - 0.5);
                      }
                    : undefined
            }
            onPointerLeave={active ? () => { px.set(0); py.set(0); } : undefined}
            whileHover={active && scale !== 1 ? { scale } : undefined}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
        >
            {children}
        </motion.div>
    );
}
