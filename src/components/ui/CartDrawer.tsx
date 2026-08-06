'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '@/lib/CartContext';
import styles from './CartDrawer.module.css';
import { motion, AnimatePresence } from 'framer-motion';

/** Kowalski springs — presses, entrances, and the shipping bar all move through physics. */
const spring = {
    snappy: { type: 'spring', stiffness: 500, damping: 30, mass: 0.5 },
    gentle: { type: 'spring', stiffness: 380, damping: 26, mass: 0.7 },
} as const;

const CartDrawer = () => {
    const { items, isCartOpen, closeCart, updateQuantity, removeFromCart, cartTotal } = useCart();

    const shippingTarget = 1500; // Free shipping above ₹1500
    const shippingProgress = Math.min(100, (cartTotal / shippingTarget) * 100);
    const neededForShipping = shippingTarget - cartTotal;

    const containerVariants = {
        hidden: {},
        show: {
            transition: {
                staggerChildren: 0.05,
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        show: { 
            opacity: 1, 
            y: 0, 
            transition: { type: 'spring' as const, stiffness: 260, damping: 24 } 
        },
        exit: { 
            opacity: 0, 
            x: 20, 
            transition: { duration: 0.15 } 
        }
    };

    return (
        <AnimatePresence>
            {isCartOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className={styles.overlay}
                    onClick={closeCart}
                >
                    {/* Drawer Content */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', stiffness: 280, damping: 28 }}
                        className={styles.drawer}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className={styles.header}>
                            <div className={styles.titleRow}>
                                <ShoppingBag size={20} className={styles.cartIcon} />
                                <h2>YOUR BAG</h2>
                                <span className={styles.countBadge}>
                                    {items.reduce((acc, item) => acc + item.quantity, 0)}
                                </span>
                            </div>
                            <motion.button
                                className={styles.closeBtn}
                                onClick={closeCart}
                                aria-label="Close Cart"
                                whileHover={{ scale: 1.12 }}
                                whileTap={{ scale: 0.88 }}
                                transition={spring.snappy}
                            >
                                <X size={20} />
                            </motion.button>
                        </div>

                        {/* Free Shipping Progress Indicator */}
                        {items.length > 0 && (
                            <div className={styles.shippingBarContainer}>
                                <p className={styles.shippingText}>
                                    {neededForShipping > 0 ? (
                                        <>Add <strong>₹{neededForShipping}</strong> more for <strong>FREE SHIPPING</strong></>
                                    ) : (
                                        <strong>You've unlocked free shipping.</strong>
                                    )}
                                </p>
                                <div className={styles.progressBar}>
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${shippingProgress}%` }}
                                        transition={{ ...spring.gentle, delay: 0.15 }}
                                        className={styles.progressFill}
                                    />
                                </div>
                            </div>
                        )}

                        <div className={styles.content}>
                            {items.length === 0 ? (
                                <div className={styles.emptyState}>
                                    <ShoppingBag size={48} className={styles.emptyIcon} />
                                    <p>Your shopping bag is empty.</p>
                                    <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }} transition={spring.snappy}>
                                        <Link href="/shop" onClick={closeCart} className={styles.shopBtn}>
                                            SHOP LATEST DROPS
                                        </Link>
                                    </motion.div>
                                </div>
                            ) : (
                                <motion.div 
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="show"
                                    className={styles.itemsList}
                                >
                                    <AnimatePresence mode="popLayout">
                                        {items.map(item => (
                                            <motion.div
                                                key={`${item.id}-${item.size}`}
                                                variants={itemVariants}
                                                layout
                                                className={styles.itemRow}
                                            >
                                                <Image src={item.imageUrl} alt={item.name} width={72} height={96} className={styles.itemImg} />
                                                <div className={styles.itemMeta}>
                                                    <h3 className={styles.itemName}>{item.name}</h3>
                                                    <p className={styles.itemSize}>Size: <strong>{item.size}</strong></p>
                                                    <div className={styles.itemQtyControls}>
                                                        <motion.button
                                                            onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                                                            className={styles.qtyBtn}
                                                            whileTap={{ scale: 0.85 }}
                                                            transition={spring.snappy}
                                                            aria-label="Decrease quantity"
                                                        >
                                                            <Minus size={12} />
                                                        </motion.button>
                                                        <span className={styles.qtyVal}>{item.quantity}</span>
                                                        <motion.button
                                                            onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                                                            className={styles.qtyBtn}
                                                            whileTap={{ scale: 0.85 }}
                                                            transition={spring.snappy}
                                                            aria-label="Increase quantity"
                                                        >
                                                            <Plus size={12} />
                                                        </motion.button>
                                                    </div>
                                                </div>
                                                <div className={styles.itemActionCol}>
                                                    <span className={styles.itemPrice}>₹{item.price * item.quantity}</span>
                                                    <motion.button
                                                        onClick={() => removeFromCart(item.id, item.size)}
                                                        className={styles.removeBtn}
                                                        aria-label="Remove item"
                                                        whileHover={{ scale: 1.15 }}
                                                        whileTap={{ scale: 0.85 }}
                                                        transition={spring.snappy}
                                                    >
                                                        <Trash2 size={14} />
                                                    </motion.button>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </motion.div>
                            )}
                        </div>

                        {items.length > 0 && (
                            <div className={styles.footer}>
                                <div className={styles.subtotalRow}>
                                    <span>Subtotal</span>
                                    <span className={styles.totalPrice}>₹{cartTotal}</span>
                                </div>
                                <p className={styles.taxNotice}>Shipping & taxes calculated at checkout.</p>
                                
                                <div className={styles.actions}>
                                    <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }} transition={spring.snappy}>
                                        <Link href="/checkout" onClick={closeCart} className={styles.checkoutBtn}>
                                            PROCEED TO CHECKOUT
                                        </Link>
                                    </motion.div>
                                    <motion.div whileTap={{ scale: 0.97 }} transition={spring.snappy}>
                                        <Link href="/cart" onClick={closeCart} className={styles.viewCartBtn}>
                                            VIEW BAG DETAILS
                                        </Link>
                                    </motion.div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CartDrawer;
