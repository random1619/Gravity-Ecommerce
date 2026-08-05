'use client';

import React, { useMemo, useState } from 'react';
import styles from './page.module.css';
import Button from '@/components/ui/Button';
import Magnetic from '@/components/motion/Magnetic';
import Link from 'next/link';
import { useCart } from '@/lib/CartContext';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
    const { items, cartTotal, clearCart } = useCart();
    const router = useRouter();
    const [isPlacing, setIsPlacing] = useState(false);

    const getInitialDiscountState = () => {
        if (typeof window === 'undefined') return { isVerified: false, appliedPromo: '' };
        return {
            isVerified: localStorage.getItem('gravity-student-verified') === 'true',
            appliedPromo: localStorage.getItem('gravity-applied-promo') || '',
        };
    };

    const [{ isVerified, appliedPromo }] = useState(getInitialDiscountState);
    const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', city: '', state: '', postal: '' });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (!form.name.trim()) newErrors.name = 'Name is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Valid email is required';
        if (!/^\+?\d{10,15}$/.test(form.phone.replace(/[\s-]/g, ''))) newErrors.phone = 'Valid phone number is required';
        if (!form.address.trim()) newErrors.address = 'Address is required';
        if (!form.city.trim()) newErrors.city = 'City is required';
        if (!form.state.trim()) newErrors.state = 'State is required';
        if (!/^\d{5,6}$/.test(form.postal)) newErrors.postal = 'Valid postal code is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const isDiscountEligible = isVerified || appliedPromo === 'STUDENT20';
    const subtotal = cartTotal;
    const studentDiscount = isDiscountEligible ? Math.round(subtotal * 0.2) : 0;
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
        if (!validateForm()) return;
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
                                <label htmlFor="checkout-name">Full Name</label>
                                <input id="checkout-name" type="text" autoComplete="name" placeholder="Your name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                                {errors.name && <span className={styles.errorText}>{errors.name}</span>}
                            </div>
                            <div className={styles.inputGroup}>
                                <label htmlFor="checkout-email">Email</label>
                                <input id="checkout-email" type="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                                {errors.email && <span className={styles.errorText}>{errors.email}</span>}
                            </div>
                            <div className={styles.inputGroup}>
                                <label htmlFor="checkout-phone">Phone</label>
                                <input id="checkout-phone" type="tel" autoComplete="tel" placeholder="+91 00000 00000" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                                {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
                            </div>
                        </div>
                    </div>

                    <div className={styles.card}>
                        <h2>Shipping Address</h2>
                        <div className={styles.grid}>
                            <div className={styles.inputGroupWide}>
                                <label htmlFor="checkout-address">Address</label>
                                <input id="checkout-address" type="text" autoComplete="street-address" placeholder="House no, street, area" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
                                {errors.address && <span className={styles.errorText}>{errors.address}</span>}
                            </div>
                            <div className={styles.inputGroup}>
                                <label htmlFor="checkout-city">City</label>
                                <input id="checkout-city" type="text" autoComplete="address-level2" placeholder="Mumbai" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} />
                                {errors.city && <span className={styles.errorText}>{errors.city}</span>}
                            </div>
                            <div className={styles.inputGroup}>
                                <label htmlFor="checkout-state">State</label>
                                <input id="checkout-state" type="text" autoComplete="address-level1" placeholder="Maharashtra" value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))} />
                                {errors.state && <span className={styles.errorText}>{errors.state}</span>}
                            </div>
                            <div className={styles.inputGroup}>
                                <label htmlFor="checkout-postal">Postal Code</label>
                                <input id="checkout-postal" type="text" autoComplete="postal-code" inputMode="numeric" placeholder="400001" value={form.postal} onChange={e => setForm(f => ({ ...f, postal: e.target.value }))} />
                                {errors.postal && <span className={styles.errorText}>{errors.postal}</span>}
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
                        {studentDiscount > 0 && (
                            <div className={`${styles.lineItem} ${styles.discount}`}>
                                <span>Student Discount</span>
                                <span>-Rs. {studentDiscount}</span>
                            </div>
                        )}
                        <div className={styles.lineItem}>
                            <span>Shipping</span>
                            <span>{shipping === 0 ? 'FREE' : `Rs. ${shipping}`}</span>
                        </div>
                        <div className={styles.total}>
                            <span>Total</span>
                            <span>Rs. {total}</span>
                        </div>
                        <Magnetic range={60} strength={0.15} className={styles.placeOrderWrap}>
                            <Button
                                variant="primary"
                                size="full"
                                onClick={handlePlaceOrder}
                                isLoading={isPlacing}
                            >
                                Place Order
                            </Button>
                        </Magnetic>
                        <p className={styles.note}>By placing the order you agree to our return policy.</p>
                    </div>
                </aside>
            </div>
        </div>
    );
}
