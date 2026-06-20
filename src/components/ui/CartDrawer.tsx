'use client';

import React from 'react';
import Link from 'next/link';
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '@/lib/CartContext';
import styles from './CartDrawer.module.css';

const CartDrawer = () => {
    const { items, isCartOpen, closeCart, updateQuantity, removeFromCart, cartTotal } = useCart();
    
    if (!isCartOpen) return null;

    const shippingTarget = 1500; // Free shipping above ₹1500
    const shippingProgress = Math.min(100, (cartTotal / shippingTarget) * 100);
    const neededForShipping = shippingTarget - cartTotal;

    return (
        <div className={styles.overlay} onClick={closeCart}>
            <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <div className={styles.titleRow}>
                        <ShoppingBag size={20} className={styles.cartIcon} />
                        <h2>YOUR BAG</h2>
                        <span className={styles.countBadge}>
                            {items.reduce((acc, item) => acc + item.quantity, 0)}
                        </span>
                    </div>
                    <button className={styles.closeBtn} onClick={closeCart} aria-label="Close Cart">
                        <X size={20} />
                    </button>
                </div>

                {/* Free Shipping Progress Indicator */}
                {items.length > 0 && (
                    <div className={styles.shippingBarContainer}>
                        <p className={styles.shippingText}>
                            {neededForShipping > 0 ? (
                                <>Add <strong>₹{neededForShipping}</strong> more for <strong>FREE SHIPPING</strong></>
                            ) : (
                                <strong>🎉 YOU HAVE UNLOCKED FREE SHIPPING!</strong>
                            )}
                        </p>
                        <div className={styles.progressBar}>
                            <div className={styles.progressFill} style={{ width: `${shippingProgress}%` }}></div>
                        </div>
                    </div>
                )}

                <div className={styles.content}>
                    {items.length === 0 ? (
                        <div className={styles.emptyState}>
                            <ShoppingBag size={48} className={styles.emptyIcon} />
                            <p>Your shopping bag is empty.</p>
                            <Link href="/shop" onClick={closeCart} className={styles.shopBtn}>
                                SHOP LATEST DROPS
                            </Link>
                        </div>
                    ) : (
                        <div className={styles.itemsList}>
                            {items.map(item => (
                                <div key={`${item.id}-${item.size}`} className={styles.itemRow}>
                                    <img src={item.imageUrl} alt={item.name} className={styles.itemImg} />
                                    <div className={styles.itemMeta}>
                                        <h3 className={styles.itemName}>{item.name}</h3>
                                        <p className={styles.itemSize}>Size: <strong>{item.size}</strong></p>
                                        <div className={styles.itemQtyControls}>
                                            <button 
                                                onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                                                className={styles.qtyBtn}
                                            >
                                                <Minus size={12} />
                                            </button>
                                            <span className={styles.qtyVal}>{item.quantity}</span>
                                            <button 
                                                onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                                                className={styles.qtyBtn}
                                            >
                                                <Plus size={12} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className={styles.itemActionCol}>
                                        <span className={styles.itemPrice}>₹{item.price * item.quantity}</span>
                                        <button 
                                            onClick={() => removeFromCart(item.id, item.size)}
                                            className={styles.removeBtn}
                                            aria-label="Remove item"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
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
                            <Link href="/checkout" onClick={closeCart} className={styles.checkoutBtn}>
                                PROCEED TO CHECKOUT
                            </Link>
                            <Link href="/cart" onClick={closeCart} className={styles.viewCartBtn}>
                                VIEW BAG DETAILS
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartDrawer;
