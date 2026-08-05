'use client';

import React from 'react';
import styles from './page.module.css';
import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function SuccessPage() {
    return (
        <div className={`container ${styles.successPage}`}>
            <div className={styles.card}>
                <div className={styles.icon}>✓</div>
                <h1>Order Confirmed</h1>
                <p>Your order is in. We are preparing the shipment and will notify you soon.</p>
                <div className={styles.actions}>
                    <Link href="/orders">
                        <Button variant="primary" size="lg">Track Order</Button>
                    </Link>
                    <Link href="/shop" className={styles.secondaryLink}>Continue Shopping</Link>
                </div>
            </div>
        </div>
    );
}
