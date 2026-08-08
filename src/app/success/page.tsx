'use client';

import React from 'react';
import { motion } from 'framer-motion';
import styles from './page.module.css';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import SplitTextReveal from '@/components/motion/SplitTextReveal';
import { Check, Package, Truck, ReceiptText, ArrowRight } from 'lucide-react';

/**
 * Kowalski presets — the seal pops with a soft overshoot, the timeline
 * stages in on the gentle spring, buttons compress on press.
 */
const spring = {
    seal: { type: 'spring', stiffness: 380, damping: 17, mass: 0.7 },
    tick: { type: 'spring', stiffness: 500, damping: 22, mass: 0.5 },
    gentle: { type: 'spring', stiffness: 380, damping: 26, mass: 0.7 },
    press: { type: 'spring', stiffness: 500, damping: 30, mass: 0.5 },
} as const;

const steps = [
    {
        icon: ReceiptText,
        title: 'Order confirmed',
        body: 'We have your order and payment. A confirmation email is on its way.',
    },
    {
        icon: Package,
        title: 'Packed with care',
        body: 'Your pieces are folded, tagged, and sealed within 1–2 business days.',
    },
    {
        icon: Truck,
        title: 'On its way',
        body: 'Tracking lands in your inbox the moment the courier picks it up.',
    },
];

const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.09, delayChildren: 0.35 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: spring.gentle },
};

export default function SuccessPage() {
    return (
        <div className={`container ${styles.successPage}`}>
            <motion.div
                className={styles.card}
                initial={{ opacity: 0, y: 24, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={spring.gentle}
            >
                {/* Seal: ring pops first, the tick snaps in a beat later. */}
                <motion.div
                    className={styles.icon}
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ ...spring.seal, delay: 0.1 }}
                    aria-hidden="true"
                >
                    <motion.span
                        className={styles.iconTick}
                        initial={{ scale: 0, rotate: -30 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ ...spring.tick, delay: 0.32 }}
                    >
                        <Check size={34} strokeWidth={2.5} />
                    </motion.span>
                </motion.div>

                <h1><SplitTextReveal text="Order Confirmed" delay={0.25} /></h1>

                <motion.p
                    className={styles.lede}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...spring.gentle, delay: 0.45 }}
                >
                    Your order is in. We are preparing the shipment and will notify you soon.
                </motion.p>

                <motion.span
                    className={styles.orderChip}
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ ...spring.tick, delay: 0.55 }}
                >
                    Order <strong>#GRV-042</strong>
                </motion.span>

                {/* What happens next — staged timeline so the wait feels designed. */}
                <motion.ol
                    className={styles.timeline}
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    aria-label="What happens next"
                >
                    {steps.map((step, i) => (
                        <motion.li key={step.title} className={styles.step} variants={itemVariants}>
                            <span className={styles.stepIcon} aria-hidden="true">
                                <step.icon size={18} strokeWidth={2} />
                            </span>
                            <span className={styles.stepText}>
                                <strong>{step.title}</strong>
                                <span>{step.body}</span>
                            </span>
                            {i < steps.length - 1 && <span className={styles.stepRail} aria-hidden="true" />}
                        </motion.li>
                    ))}
                </motion.ol>

                <motion.div
                    className={styles.actions}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...spring.gentle, delay: 0.85 }}
                >
                    <motion.div whileTap={{ scale: 0.97 }} transition={spring.press}>
                        <Link href="/orders">
                            <Button variant="primary" size="lg">
                                Track Order
                                <ArrowRight size={18} />
                            </Button>
                        </Link>
                    </motion.div>
                    <motion.div whileTap={{ scale: 0.97 }} transition={spring.press}>
                        <Link href="/shop" className={styles.secondaryLink}>Continue Shopping</Link>
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    );
}
