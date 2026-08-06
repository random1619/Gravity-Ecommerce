'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import styles from './page.module.css';

/** Kowalski springs — entrances, re-flow, and press all move through physics. */
const spring = {
    press: { type: 'spring', stiffness: 500, damping: 30, mass: 0.5 },
    layout: { type: 'spring', stiffness: 350, damping: 32, mass: 0.8 },
} as const;

const listVariants: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

const rowVariants: Variants = {
    hidden: { opacity: 0, y: 18, scale: 0.98 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 380, damping: 26, mass: 0.7 } },
    exit: { opacity: 0, x: -24, scale: 0.97, transition: { duration: 0.18 } },
};
import Button from '@/components/ui/Button';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/lib/CartContext';
import SplitTextReveal from '@/components/motion/SplitTextReveal';
import {
    APPLIED_PROMO_KEY,
    STUDENT_VERIFIED_KEY,
    isDiscountEligible,
    normalizePromoCode,
    studentDiscount,
} from '@/lib/discount';
import { GraduationCap } from 'lucide-react';

export default function Cart() {
    const { items: cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();

    const [isVerified] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem(STUDENT_VERIFIED_KEY) === 'true';
        }
        return false;
    });
    const [promoInput, setPromoInput] = useState('');
    const [appliedPromo, setAppliedPromo] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem(APPLIED_PROMO_KEY) || '';
        }
        return '';
    });
    const [promoStatus, setPromoStatus] = useState<{ message: string; type: 'success' | 'error' | null }>({
        message: '',
        type: null
    });

    const handleApplyPromo = (e: React.FormEvent) => {
        e.preventDefault();
        if (promoInput.trim() === '') {
            setPromoStatus({ message: 'Please enter a promo code.', type: 'error' });
            return;
        }
        const code = normalizePromoCode(promoInput);
        if (code) {
            setAppliedPromo(code);
            localStorage.setItem(APPLIED_PROMO_KEY, code);
            setPromoStatus({ message: 'Promo code applied! 20% Discount active.', type: 'success' });
            setPromoInput('');
        } else {
            setPromoStatus({ message: 'Invalid promo code.', type: 'error' });
        }
    };

    const handleRemovePromo = () => {
        setAppliedPromo('');
        localStorage.removeItem(APPLIED_PROMO_KEY);
        setPromoStatus({ message: 'Promo code removed.', type: null });
    };

    const subtotal = cartTotal;
    const discountEligible = isDiscountEligible(isVerified, appliedPromo);
    const discount = studentDiscount(subtotal, isVerified, appliedPromo);
    const total = subtotal - discount;

    if (cartItems.length === 0) {
        return (
            <div className={`container ${styles.cartPage}`}>
                <h1 className={styles.title}><SplitTextReveal text="YOUR BAG" /></h1>
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
            <h1 className={styles.title}><SplitTextReveal text="YOUR BAG" /></h1>

            <div className={styles.cartLayout}>
                <motion.main className={styles.itemsList} variants={listVariants} initial="hidden" animate="show">
                    <AnimatePresence initial={false}>
                    {cartItems.map(item => (
                        <motion.div
                            key={`${item.id}-${item.size}`}
                            className={styles.item}
                            variants={rowVariants}
                            layout
                            exit="exit"
                            transition={spring.layout}
                            whileHover={{ y: -2 }}
                        >
                            <div className={styles.itemImage}>
                                <Image src={item.imageUrl} alt={item.name} width={120} height={160} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <div className={styles.itemInfo}>
                                <div className={styles.itemHeader}>
                                    <h3>{item.name}</h3>
                                    <p className={styles.itemPrice}>₹{item.price * item.quantity}</p>
                                </div>
                                <p className={styles.itemMeta}>Size: {item.size} | Qty: {item.quantity}</p>
                                <div className={styles.itemActions}>
                                    <motion.button
                                        className={styles.actionBtn}
                                        onClick={() => removeFromCart(item.id, item.size)}
                                        whileHover={{ y: -1 }}
                                        whileTap={{ scale: 0.94 }}
                                        transition={spring.press}
                                    >
                                        Remove
                                    </motion.button>
                                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                        <motion.button
                                            className={styles.actionBtn}
                                            onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                                            whileTap={{ scale: 0.9 }}
                                            transition={spring.press}
                                            aria-label="Decrease quantity"
                                        >
                                            -
                                        </motion.button>
                                        <span>{item.quantity}</span>
                                        <motion.button
                                            className={styles.actionBtn}
                                            onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                                            whileTap={{ scale: 0.9 }}
                                            transition={spring.press}
                                            aria-label="Increase quantity"
                                        >
                                            +
                                        </motion.button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                    </AnimatePresence>

                    {discountEligible ? (
                        <div className={styles.studentOffer}>
                            <div className={styles.offerIcon}><GraduationCap size={28} strokeWidth={1.5} /></div>
                            <div>
                                <h4>Discount Applied</h4>
                                <p>
                                    You&apos;ve saved extra ₹{discount} using {isVerified ? 'your verified student status' : `promo code ${appliedPromo}`}.
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
                </motion.main>

                <aside className={styles.summary}>
                    <h3>ORDER SUMMARY</h3>
                    <div className={styles.summaryLine}>
                        <span>Subtotal</span>
                        <span>₹{subtotal}</span>
                    </div>
                    {discount > 0 && (
                        <div className={`${styles.summaryLine} ${styles.discountLine}`}>
                            <span>Discount (20%)</span>
                            <span>-₹{discount}</span>
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
