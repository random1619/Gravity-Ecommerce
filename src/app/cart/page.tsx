'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import styles from './page.module.css';

/**
 * Kowalski springs — every press, entrance, stepper, and re-flow moves through
 * physics (interruptible, velocity-aware), never fixed durations.
 * Damping 1.0 → critically damped, no overshoot, the Apple default for UI.
 */
const spring = {
    press: { type: 'spring', stiffness: 500, damping: 30, mass: 0.5 },
    layout: { type: 'spring', stiffness: 350, damping: 32, mass: 0.8 },
    gentle: { type: 'spring', stiffness: 380, damping: 26, mass: 0.7 },
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
import { GraduationCap, Minus, Plus, Trash2, ArrowRight, ShoppingBag, Truck } from 'lucide-react';

const FREE_SHIPPING_THRESHOLD = 1500;

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

    const shippingProgress = Math.min(1, subtotal / FREE_SHIPPING_THRESHOLD);
    const neededForShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

    /* ----- Empty state: a calm editorial void, not a dead end ----- */
    if (cartItems.length === 0) {
        return (
            <div className={`container ${styles.cartPage}`}>
                <div className={styles.emptyWrap}>
                    <motion.div
                        className={styles.emptyIconRing}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={spring.gentle}
                    >
                        <ShoppingBag size={40} strokeWidth={1.25} />
                    </motion.div>
                    <motion.h1
                        className={styles.emptyTitle}
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ ...spring.gentle, delay: 0.08 }}
                    >
                        Your bag is empty
                    </motion.h1>
                    <motion.p
                        className={styles.emptySub}
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ ...spring.gentle, delay: 0.16 }}
                    >
                        Nothing here yet. The latest drop won&apos;t wait.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ ...spring.gentle, delay: 0.24 }}
                    >
                        <Link href="/shop">
                            <Button variant="primary" size="lg">Shop the Drop</Button>
                        </Link>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className={`container ${styles.cartPage}`}>
            {/* Header — editorial masthead */}
            <header className={styles.masthead}>
                <h1 className={styles.title}><SplitTextReveal text="YOUR BAG" /></h1>
                <p className={styles.mastheadMeta}>
                    {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
                </p>
            </header>

            {/* Free-shipping progress — a real, honest meter (no fake progress) */}
            <motion.div
                className={styles.shippingHero}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={spring.gentle}
            >
                <div className={styles.shippingText}>
                    <Truck size={18} strokeWidth={1.75} className={styles.shippingIcon} />
                    {neededForShipping > 0 ? (
                        <p>Add <strong>₹{neededForShipping}</strong> more to unlock <strong>free shipping</strong>.</p>
                    ) : (
                        <p><strong>Free shipping unlocked.</strong> Nice.</p>
                    )}
                </div>
                <div className={styles.shippingTrack} role="progressbar" aria-valuenow={Math.round(shippingProgress * 100)} aria-valuemin={0} aria-valuemax={100} aria-label="Progress toward free shipping">
                    <motion.div
                        className={styles.shippingFill}
                        initial={{ width: 0 }}
                        animate={{ width: `${shippingProgress * 100}%` }}
                        transition={{ ...spring.gentle, delay: 0.2 }}
                    />
                </div>
            </motion.div>

            <div className={styles.cartLayout}>
                <motion.main className={styles.itemsList} variants={listVariants} initial="hidden" animate="show">
                    <AnimatePresence initial={false}>
                    {cartItems.map(item => (
                        <motion.article
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
                                <p className={styles.itemMeta}>Size {item.size}</p>
                                <div className={styles.itemActions}>
                                    {/* Quantity stepper — direct manipulation, press on pointer-down */}
                                    <div className={styles.stepper} role="group" aria-label={`Quantity for ${item.name}`}>
                                        <motion.button
                                            className={styles.stepBtn}
                                            onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                                            whileTap={{ scale: 0.85 }}
                                            transition={spring.press}
                                            aria-label="Decrease quantity"
                                        >
                                            <Minus size={14} strokeWidth={2.25} />
                                        </motion.button>
                                        <span className={styles.stepVal} aria-live="polite">{item.quantity}</span>
                                        <motion.button
                                            className={styles.stepBtn}
                                            onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                                            whileTap={{ scale: 0.85 }}
                                            transition={spring.press}
                                            aria-label="Increase quantity"
                                        >
                                            <Plus size={14} strokeWidth={2.25} />
                                        </motion.button>
                                    </div>
                                    <motion.button
                                        className={styles.removeBtn}
                                        onClick={() => removeFromCart(item.id, item.size)}
                                        whileHover={{ y: -1 }}
                                        whileTap={{ scale: 0.9 }}
                                        transition={spring.press}
                                        aria-label={`Remove ${item.name} from bag`}
                                    >
                                        <Trash2 size={14} strokeWidth={2} />
                                        <span>Remove</span>
                                    </motion.button>
                                </div>
                            </div>
                        </motion.article>
                    ))}
                    </AnimatePresence>

                    {discountEligible ? (
                        <motion.div className={styles.studentOffer} layout>
                            <div className={styles.offerIcon}><GraduationCap size={26} strokeWidth={1.5} /></div>
                            <div className={styles.offerBody}>
                                <h4>Discount applied</h4>
                                <p>
                                    You saved an extra ₹{discount} with {isVerified ? 'your verified student status' : `promo code ${appliedPromo}`}.
                                    {!isVerified && (
                                        <button onClick={handleRemovePromo} className={styles.removePromoBtn}>
                                            Remove promo
                                        </button>
                                    )}
                                </p>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div className={styles.studentBanner} layout>
                            <div className={styles.bannerText}>
                                <h4>Are you a student?</h4>
                                <p>Verify your student status for an extra 20% off every drop.</p>
                            </div>
                            <Link href="/discount" className={styles.bannerLink}>
                                Verify now <ArrowRight size={14} strokeWidth={2.25} />
                            </Link>
                        </motion.div>
                    )}
                </motion.main>

                {/* Order summary — a floating material panel */}
                <aside className={styles.summary}>
                    <h3 className={styles.summaryTitle}>Order summary</h3>
                    <div className={styles.summaryLine}>
                        <span>Subtotal</span>
                        <span>₹{subtotal}</span>
                    </div>
                    {discount > 0 && (
                        <div className={`${styles.summaryLine} ${styles.discountLine}`}>
                            <span>Student discount (20%)</span>
                            <span>−₹{discount}</span>
                        </div>
                    )}
                    <div className={styles.summaryLine}>
                        <span>Shipping</span>
                        <span className={styles.free}>{neededForShipping > 0 ? 'Calculated at checkout' : 'FREE'}</span>
                    </div>
                    <div className={`${styles.summaryLine} ${styles.totalLine}`}>
                        <span>Total</span>
                        <span>₹{total}</span>
                    </div>

                    <Link href="/checkout" className={styles.checkoutLink}>
                        <Button variant="primary" size="full" className={styles.checkoutBtn}>
                            Checkout
                        </Button>
                    </Link>

                    <div className={styles.promoSection}>
                        <label htmlFor="promo-input" className={styles.promoLabel}>Have a promo code?</label>
                        <form onSubmit={handleApplyPromo} className={styles.promoForm}>
                            <input
                                id="promo-input"
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

                    <div className={styles.paymentMethods}>
                        <p>We accept</p>
                        <div className={styles.icons}>
                            <span>UPI</span>
                            <span>Cards</span>
                            <span>Net Banking</span>
                        </div>
                    </div>

                    <Link href="/shop" className={styles.continue}>← Continue shopping</Link>
                </aside>
            </div>
        </div>
    );
}
