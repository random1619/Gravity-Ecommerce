'use client';

import React from 'react';
import styles from './page.module.css';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { useCart } from '@/lib/CartContext';

export default function Cart() {
    const { items: cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();
    const subtotal = cartTotal;
    const studentDiscount = Math.round(subtotal * 0.2);
    const total = subtotal - studentDiscount;

    if (cartItems.length === 0) {
        return (
            <div className={`container ${styles.cartPage}`}>
                <h1 className={styles.title}>YOUR BAG</h1>
                <div style={{ textAlign: 'center', padding: '100px 20px' }}>
                    <h2>Your cart is empty</h2>
                    <p style={{ marginTop: '20px', marginBottom: '30px' }}>Add some items to get started!</p>
                    <Link href="/shop">
                        <Button variant="primary" size="lg">Shop Now</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className={`container ${styles.cartPage}`}>
            <h1 className={styles.title}>YOUR BAG</h1>

            <div className={styles.cartLayout}>
                <main className={styles.itemsList}>
                    {cartItems.map(item => (
                        <div key={`${item.id}-${item.size}`} className={styles.item}>
                            <div className={styles.itemImage}>
                                <img src={item.imageUrl} alt={item.name} />
                            </div>
                            <div className={styles.itemInfo}>
                                <div className={styles.itemHeader}>
                                    <h3>{item.name}</h3>
                                    <p className={styles.itemPrice}>₹{item.price}</p>
                                </div>
                                <p className={styles.itemMeta}>Size: {item.size} | Qty: {item.quantity}</p>
                                <div className={styles.itemActions}>
                                    <button
                                        className={styles.actionBtn}
                                        onClick={() => removeFromCart(item.id, item.size)}
                                    >
                                        Remove
                                    </button>
                                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                        <button
                                            className={styles.actionBtn}
                                            onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                                        >
                                            -
                                        </button>
                                        <span>{item.quantity}</span>
                                        <button
                                            className={styles.actionBtn}
                                            onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className={styles.studentOffer}>
                        <div className={styles.offerIcon}>🎓</div>
                        <div>
                            <h4>Student Discount Applied</h4>
                            <p>You&apos;ve saved extra ₹{studentDiscount} using your verified status.</p>
                        </div>
                    </div>
                </main>

                <aside className={styles.summary}>
                    <h3>ORDER SUMMARY</h3>
                    <div className={styles.summaryLine}>
                        <span>Subtotal</span>
                        <span>₹{subtotal}</span>
                    </div>
                    <div className={`${styles.summaryLine} ${styles.discountLine}`}>
                        <span>Student Discount (20%)</span>
                        <span>-₹{studentDiscount}</span>
                    </div>
                    <div className={styles.summaryLine}>
                        <span>Shipping</span>
                        <span className={styles.free}>FREE</span>
                    </div>
                    <div className={`${styles.summaryLine} ${styles.totalLine}`}>
                        <span>TOTAL</span>
                        <span>₹{total}</span>
                    </div>

                    <Link href="/checkout">
                        <Button variant="primary" size="full" className={styles.checkoutBtn}>
                            CHECKOUT NOW
                        </Button>
                    </Link>

                    <div className={styles.paymentMethods}>
                        <p>WE ACCEPT</p>
                        <div className={styles.icons}>
                            <span>UPI</span>
                            <span>Cards</span>
                            <span>Net Banking</span>
                        </div>
                    </div>

                    <Link href="/shop" className={styles.continue}>← Continue Shopping</Link>
                </aside>
            </div>
        </div>
    );
}
