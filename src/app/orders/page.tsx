'use client';

import React from 'react';
import { motion } from 'framer-motion';
import styles from './page.module.css';
import { useAuth } from '@/lib/AuthContext';
import Link from 'next/link';
import SplitTextReveal from '@/components/motion/SplitTextReveal';
import StaggerGrid from '@/components/motion/StaggerGrid';
import { PackageOpen, Package, Truck, CheckCircle2, ArrowRight, LogIn } from 'lucide-react';

/** Kowalski presets — press feedback and gentle staged entrances. */
const spring = {
    gentle: { type: 'spring', stiffness: 380, damping: 26, mass: 0.7 },
    press: { type: 'spring', stiffness: 500, damping: 30, mass: 0.5 },
} as const;

interface OrderItem {
    name: string;
    size: string;
    quantity: number;
    price: number;
}

interface Order {
    id: string;
    date: string;
    status: 'Delivered' | 'In Transit';
    total: number;
    items: OrderItem[];
}

// Mock orders data
const orders: Order[] = [
    {
        id: 'ORD-2024-001',
        date: '2024-01-15',
        status: 'Delivered',
        total: 1499,
        items: [
            { name: 'Oversized Graffiti Tee', size: 'L', quantity: 1, price: 699 },
            { name: 'Vintage Wash Hoodie', size: 'XL', quantity: 1, price: 800 },
        ],
    },
    {
        id: 'ORD-2024-002',
        date: '2024-01-28',
        status: 'In Transit',
        total: 899,
        items: [
            { name: 'Classic Logo Tee', size: 'M', quantity: 1, price: 499 },
            { name: 'Cargo Joggers', size: 'L', quantity: 1, price: 400 },
        ],
    },
];

const STAGES = [
    { key: 'placed', label: 'Placed', icon: Package },
    { key: 'shipped', label: 'Shipped', icon: Truck },
    { key: 'delivered', label: 'Delivered', icon: CheckCircle2 },
] as const;

function stageIndex(status: Order['status']): number {
    return status === 'Delivered' ? 2 : 1;
}

function OrderTracker({ status }: { status: Order['status'] }) {
    const current = stageIndex(status);
    return (
        <ol className={styles.tracker} aria-label={`Order status: ${status}`}>
            {STAGES.map((stage, i) => {
                const done = i <= current;
                return (
                    <li key={stage.key} className={`${styles.trackStep} ${done ? styles.trackDone : ''}`}>
                        <span className={styles.trackDot} aria-hidden="true">
                            <stage.icon size={14} strokeWidth={2} />
                        </span>
                        <span className={styles.trackLabel}>{stage.label}</span>
                        {i < STAGES.length - 1 && (
                            <span
                                className={`${styles.trackRail} ${i < current ? styles.trackRailDone : ''}`}
                                aria-hidden="true"
                            />
                        )}
                    </li>
                );
            })}
        </ol>
    );
}

export default function OrdersPage() {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return (
            <div className={styles.container}>
                <motion.div
                    className={styles.emptyState}
                    initial={{ opacity: 0, y: 24, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={spring.gentle}
                >
                    <motion.span
                        className={styles.emptyIcon}
                        initial={{ scale: 0.6, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ ...spring.gentle, delay: 0.1 }}
                        aria-hidden="true"
                    >
                        <PackageOpen size={30} strokeWidth={1.8} />
                    </motion.span>
                    <h1><SplitTextReveal text="My Orders" /></h1>
                    <p>Sign in to track shipments, review past orders, and manage returns.</p>
                    <motion.div whileTap={{ scale: 0.97 }} transition={spring.press}>
                        <Link href="/" className={styles.button}>
                            <LogIn size={16} />
                            Sign In
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}><SplitTextReveal text="My Orders" /></h1>
            <p className={styles.subtitle}>Track and manage your orders</p>

            <StaggerGrid className={styles.ordersList}>
                {orders.map((order) => (
                    <article key={order.id} className={styles.orderCard}>
                        <div className={styles.orderHeader}>
                            <div>
                                <h3 className={styles.orderId}>{order.id}</h3>
                                <p className={styles.orderDate}>Placed on {order.date}</p>
                            </div>
                            <span className={`${styles.status} ${styles[order.status.replace(' ', '').toLowerCase()]}`}>
                                {order.status}
                            </span>
                        </div>

                        <OrderTracker status={order.status} />

                        <div className={styles.orderItems}>
                            {order.items.map((item, idx) => (
                                <div key={idx} className={styles.orderItem}>
                                    <span className={styles.itemName}>{item.name}</span>
                                    <span className={styles.itemMeta}>Size {item.size} · Qty {item.quantity}</span>
                                    <span className={styles.itemPrice}>₹{item.price.toLocaleString('en-IN')}</span>
                                </div>
                            ))}
                        </div>

                        <div className={styles.orderFooter}>
                            <span className={styles.total}>Total <strong>₹{order.total.toLocaleString('en-IN')}</strong></span>
                            <motion.button
                                className={styles.trackBtn}
                                whileTap={{ scale: 0.96 }}
                                transition={spring.press}
                            >
                                Track Order
                                <ArrowRight size={15} />
                            </motion.button>
                        </div>
                    </article>
                ))}
            </StaggerGrid>
        </div>
    );
}
