'use client';

import React, { useMemo, useState } from 'react';
import styles from './page.module.css';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { useCart } from '@/lib/CartContext';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
    const { items, cartTotal, clearCart } = useCart();
    const router = useRouter();
    const [isPlacing, setIsPlacing] = useState(false);

    const subtotal = cartTotal;
    const studentDiscount = Math.round(subtotal * 0.2);
    const shipping = subtotal > 0 ? 0 : 0;
    const total = Math.max(subtotal - studentDiscount + shipping, 0);

    const lineItems = useMemo(() => items, [items]);

    if (items.length === 0) {
        return (
            <div className={`container ${styles.checkoutPage}`}>
                <div className={styles.emptyState}>
                    <h1>Checkout</h1>
                    <p>Your bag is empty. Add items to continue.</p>
                    <Link href="/shop">
                        <Button variant="primary" size="lg">Shop Now</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const handlePlaceOrder = () => {
        setIsPlacing(true);
        setTimeout(() => {
            clearCart();
            router.push('/success');
        }, 800);
    };

    return (
        <div className={`container ${styles.checkoutPage}`}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Checkout</h1>
                    <p className={styles.subtitle}>Complete your details to place the order.</p>
                </div>
                <Link href="/cart" className={styles.backLink}>Back to Cart</Link>
            </header>

            <div className={styles.layout}>
                <section className={styles.formSection}>
                    <div className={styles.card}>
                        <h2>Contact</h2>
                        <div className={styles.grid}>
                            <div className={styles.inputGroup}>
                                <label>Full Name</label>
                                <input type="text" placeholder="Your name" required />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Email</label>
                                <input type="email" placeholder="you@example.com" required />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Phone</label>
                                <input type="tel" placeholder="+91 00000 00000" required />
                            </div>
                        </div>
                    </div>

                    <div className={styles.card}>
                        <h2>Shipping Address</h2>
                        <div className={styles.grid}>
                            <div className={styles.inputGroupWide}>
                                <label>Address</label>
                                <input type="text" placeholder="House no, street, area" required />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>City</label>
                                <input type="text" placeholder="Mumbai" required />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>State</label>
                                <input type="text" placeholder="Maharashtra" required />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Postal Code</label>
                                <input type="text" placeholder="400001" required />
                            </div>
                        </div>
                    </div>

                    <div className={styles.card}>
                        <h2>Payment</h2>
                        <div className={styles.paymentOptions}>
                            <label className={styles.paymentOption}>
                                <input type="radio" name="payment" defaultChecked />
                                <span>UPI / Wallet</span>
                            </label>
                            <label className={styles.paymentOption}>
                                <input type="radio" name="payment" />
                                <span>Credit or Debit Card</span>
                            </label>
                            <label className={styles.paymentOption}>
                                <input type="radio" name="payment" />
                                <span>Cash on Delivery</span>
                            </label>
                        </div>
                    </div>
                </section>

                <aside className={styles.summary}>
                    <div className={styles.summaryCard}>
                        <h3>Order Summary</h3>
                        <div className={styles.summaryItems}>
                            {lineItems.map((item) => (
                                <div key={`${item.id}-${item.size}`} className={styles.summaryItem}>
                                    <div className={styles.summaryImage}>
                                        <img src={item.imageUrl} alt={item.name} />
                                    </div>
                                    <div>
                                        <p className={styles.summaryName}>{item.name}</p>
                                        <p className={styles.summaryMeta}>Size {item.size} | Qty {item.quantity}</p>
                                    </div>
                                    <span className={styles.summaryPrice}>Rs. {item.price * item.quantity}</span>
                                </div>
                            ))}
                        </div>
                        <div className={styles.lineItem}>
                            <span>Subtotal</span>
                            <span>Rs. {subtotal}</span>
                        </div>
                        <div className={`${styles.lineItem} ${styles.discount}`}>
                            <span>Student Discount</span>
                            <span>-Rs. {studentDiscount}</span>
                        </div>
                        <div className={styles.lineItem}>
                            <span>Shipping</span>
                            <span>{shipping === 0 ? 'FREE' : `Rs. ${shipping}`}</span>
                        </div>
                        <div className={styles.total}>
                            <span>Total</span>
                            <span>Rs. {total}</span>
                        </div>
                        <Button
                            variant="primary"
                            size="full"
                            onClick={handlePlaceOrder}
                            isLoading={isPlacing}
                        >
                            Place Order
                        </Button>
                        <p className={styles.note}>By placing the order you agree to our return policy.</p>
                    </div>
                </aside>
            </div>
        </div>
    );
}
