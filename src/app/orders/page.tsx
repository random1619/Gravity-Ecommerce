'use client';

import React from 'react';
import styles from './page.module.css';
import { useAuth } from '@/lib/AuthContext';
import Link from 'next/link';

export default function OrdersPage() {
    const { isAuthenticated } = useAuth();

    // Mock orders data
    const orders = [
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

    if (!isAuthenticated) {
        return (
            <div className={styles.container}>
                <div className={styles.emptyState}>
                    <h1>📦 My Orders</h1>
                    <p>Please login to view your orders</p>
                    <Link href="/" className={styles.button}>
                        Go to Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>📦 My Orders</h1>
            <p className={styles.subtitle}>Track and manage your orders</p>

            <div className={styles.ordersList}>
                {orders.map((order) => (
                    <div key={order.id} className={styles.orderCard}>
                        <div className={styles.orderHeader}>
                            <div>
                                <h3 className={styles.orderId}>{order.id}</h3>
                                <p className={styles.orderDate}>Placed on {order.date}</p>
                            </div>
                            <span className={`${styles.status} ${styles[order.status.replace(' ', '').toLowerCase()]}`}>
                                {order.status}
                            </span>
                        </div>
                        <div className={styles.orderItems}>
                            {order.items.map((item, idx) => (
                                <div key={idx} className={styles.orderItem}>
                                    <span>{item.name}</span>
                                    <span>Size: {item.size}</span>
                                    <span>Qty: {item.quantity}</span>
                                    <span>₹{item.price}</span>
                                </div>
                            ))}
                        </div>
                        <div className={styles.orderFooter}>
                            <span className={styles.total}>Total: ₹{order.total}</span>
                            <button className={styles.trackBtn}>Track Order</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
