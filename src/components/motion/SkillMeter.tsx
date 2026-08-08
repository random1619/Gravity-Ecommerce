'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import styles from './SkillMeter.module.css';

interface SkillMeterProps {
    /** Discipline name, e.g. "Craft". */
    label: string;
    /** What the discipline maps to, e.g. "Frontend design". */
    note: string;
    /** Fill level, 0–1. */
    value: number;
    /** Stagger position among sibling meters. */
    index?: number;
}

/**
 * A labeled skill meter. The fill is transform-only — scaleX sweeping from
 * the left edge — so it stays on the compositor and never touches layout.
 * Fills with a gentle spring when scrolled into view, staggered by `index`.
 * Under prefers-reduced-motion the meter renders at its final width.
 */
export default function SkillMeter({ label, note, value, index = 0 }: SkillMeterProps) {
    const reduced = useReducedMotion();
    const pct = Math.round(value * 100);

    return (
        <div className={styles.meter}>
            <div className={styles.head}>
                <span className={styles.label}>{label}</span>
                <span className={styles.note}>{note}</span>
                <span className={styles.pct} aria-hidden="true">{pct}</span>
            </div>
            <div
                className={styles.track}
                role="meter"
                aria-valuenow={pct}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${label} — ${note}`}
            >
                <motion.span
                    className={styles.fill}
                    style={{ originX: 0 }}
                    initial={reduced ? { scaleX: value } : { scaleX: 0 }}
                    whileInView={{ scaleX: value }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={
                        reduced
                            ? { duration: 0 }
                            : { type: 'spring', stiffness: 120, damping: 22, mass: 0.9, delay: 0.12 + index * 0.12 }
                    }
                />
            </div>
        </div>
    );
}
