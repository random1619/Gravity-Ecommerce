'use client';

import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { useCart } from '@/lib/CartContext';

export default function Cart() {
    const { items: cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();
    
    const [isVerified, setIsVerified] = useState(false);
    const [promoInput, setPromoInput] = useState('');
    const [appliedPromo, setAppliedPromo] = useState('');
    const [promoStatus, setPromoStatus] = useState<{ message: string; type: 'success' | 'error' | null }>({
        message: '',
        type: null
    });

    useEffect(() => {
        setIsVerified(localStorage.getItem('gravity-student-verified') === 'true');
        const savedPromo = localStorage.getItem('gravity-applied-promo');
        if (savedPromo) {
            setAppliedPromo(savedPromo);
        }
    }, []);

    const handleApplyPromo = (e: React.FormEvent) => {
        e.preventDefault();
        const code = promoInput.trim().toUpperCase();
        if (code === 'STUDENT20') {
            setAppliedPromo('STUDENT20');
            localStorage.setItem('gravity-applied-promo', 'STUDENT20');
            setPromoStatus({ message: 'Promo code applied! 20% Discount active.', type: 'success' });
            setPromoInput('');
        } else if (code === '') {
            setPromoStatus({ message: 'Please enter a promo code.', type: 'error' });
        } else {
            setPromoStatus({ message: 'Invalid promo code.', type: 'error' });
        }
    };

    const handleRemovePromo = () => {
        setAppliedPromo('');
        localStorage.removeItem('gravity-applied-promo');
        setPromoStatus({ message: 'Promo code removed.', type: null });
    };

    const subtotal = cartTotal;
    const isDiscountEligible = isVerified || appliedPromo === 'STUDENT20';
    const studentDiscount = isDiscountEligible ? Math.round(subtotal * 0.2) : 0;
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

                    {isDiscountEligible ? (
                        <div className={styles.studentOffer}>
                            <div className={styles.offerIcon}>🎓</div>
                            <div>
                                <h4>Discount Applied</h4>
                                <p>
                                    You&apos;ve saved extra ₹{studentDiscount} using {isVerified ? 'your verified student status' : 'promo code STUDENT20'}.
                                    {!isVerified && (
                                        <button onClick={handleRemovePromo} style={{ marginLeft: '10px', textDecoration: 'underline', background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontWeight: 'bold' }}>
                                            Remove Promo
                                        </button>
                                    )}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.studentBanner}>
                            <div className={styles.bannerText}>
                                <h4>Are you a student?</h4>
                                <p>Verify your student status to get an extra 20% discount on all drops.</p>
                            </div>
                            <Link href="/discount" className={styles.bannerLink}>
                                Verify Now &rarr;
                            </Link>
                        </div>
                    )}
                </main>

                <aside className={styles.summary}>
                    <h3>ORDER SUMMARY</h3>
                    <div className={styles.summaryLine}>
                        <span>Subtotal</span>
                        <span>₹{subtotal}</span>
                    </div>
                    {studentDiscount > 0 && (
                        <div className={`${styles.summaryLine} ${styles.discountLine}`}>
                            <span>Discount (20%)</span>
                            <span>-₹{studentDiscount}</span>
                        </div>
                    )}
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

                    <div className={styles.promoSection}>
                        <label style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-bold)', color: 'var(--text-secondary)' }}>
                            HAVE A PROMO CODE?
                        </label>
                        <form onSubmit={handleApplyPromo} className={styles.promoForm}>
                            <input
                                type="text"
                                placeholder="e.g. STUDENT20"
                                value={promoInput}
                                onChange={(e) => setPromoInput(e.target.value)}
                                className={styles.promoInput}
                            />
                            <button type="submit" className={styles.promoBtn}>Apply</button>
                        </form>
                        {promoStatus.type && (
                            <span className={`${styles.promoStatus} ${promoStatus.type === 'success' ? styles.promoSuccess : styles.promoError}`}>
                                {promoStatus.message}
                            </span>
                        )}
                    </div>

                    <div className={styles.paymentMethods} style={{ marginTop: '20px' }}>
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
