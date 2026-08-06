'use client';

import React from 'react';
import styles from './page.module.css';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import SplitTextReveal from '@/components/motion/SplitTextReveal';
import ScrollReveal from '@/components/motion/ScrollReveal';
import { Check } from 'lucide-react';

export default function SuccessPage() {
    return (
        <div className={`container ${styles.successPage}`}>
            <div className={styles.card}>
                <div className={styles.icon}><Check size={36} strokeWidth={2} /></div>
                <h1><SplitTextReveal text="Order Confirmed" /></h1>
                <ScrollReveal direction="up" delay={150}>
                    <p>Your order is in. We are preparing the shipment and will notify you soon.</p>
                </ScrollReveal>
                <ScrollReveal direction="up" delay={250}>
                    <div className={styles.actions}>
                        <Link href="/orders">
                            <Button variant="primary" size="lg">Track Order</Button>
                        </Link>
                        <Link href="/shop" className={styles.secondaryLink}>Continue Shopping</Link>
                    </div>
                </ScrollReveal>
            </div>
        </div>
    );
}
