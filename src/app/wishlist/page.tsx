'use client';

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Heart, LogIn } from 'lucide-react';
import styles from './page.module.css';

/** Kowalski spring presets — snappy press, gentle entrances. */
const spring = {
    press: { type: 'spring', stiffness: 500, damping: 30, mass: 0.5 },
    gentle: { type: 'spring', stiffness: 380, damping: 26, mass: 0.7 },
    seal: { type: 'spring', stiffness: 380, damping: 17, mass: 0.7 },
} as const;
import { useAuth } from '@/lib/AuthContext';
import { readStorage, isArray } from '@/lib/storage';
import Link from 'next/link';
import ProductCard from '@/components/ui/ProductCard';
import QuickView from '@/components/ui/QuickView';
import LoginModal from '@/components/ui/LoginModal';
import SplitTextReveal from '@/components/motion/SplitTextReveal';
import ScrollReveal from '@/components/motion/ScrollReveal';
import StaggerGrid from '@/components/motion/StaggerGrid';

interface Product {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    imageUrl: string;
    category: string;
    badge?: string;
    description?: string;
    sizes?: string[];
}

export default function WishlistPage() {
    const { isAuthenticated } = useAuth();
    const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
    const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
    const [showLoginModal, setShowLoginModal] = useState(false);

    useEffect(() => {
        // Load wishlist from localStorage (shape-validated — was the only
        // unguarded JSON.parse in the app; a corrupted value crashed the page).
        const saved = readStorage<Product[] | null>('gravity-wishlist', null, isArray as (v: unknown) => v is Product[]);
        if (saved) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setWishlistItems(saved);
        } else {
            // Add some demo items if empty
            const demoItems: Product[] = [
                {
                    id: '1',
                    name: 'Oversized Graffiti Tee',
                    price: 699,
                    originalPrice: 1299,
                    imageUrl: '/product-tee-premium.png',
                    category: 'T-SHIRTS',
                },
                {
                    id: '3',
                    name: 'Classic Logo Hoodie',
                    price: 1199,
                    originalPrice: 1999,
                    imageUrl: '/product-hoodie-premium.png',
                    category: 'HOODIES',
                },
            ];
            setWishlistItems(demoItems);
        }
    }, []);

    const removeFromWishlist = (id: string) => {
        const updated = wishlistItems.filter(item => item.id !== id);
        setWishlistItems(updated);
        localStorage.setItem('gravity-wishlist', JSON.stringify(updated));
    };

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
                        transition={{ ...spring.seal, delay: 0.1 }}
                        aria-hidden="true"
                    >
                        <Heart size={28} strokeWidth={1.8} />
                    </motion.span>
                    <h1 className={styles.emptyTitle}>
                        <SplitTextReveal text="My Wishlist" delay={0.15} />
                    </h1>
                    <p className={styles.emptyText}>
                        Sign in to save the pieces you love and pick up where you left off, on any device.
                    </p>
                    <motion.div whileTap={{ scale: 0.97 }} transition={spring.press}>
                        <Link href="/" className={styles.button}>
                            <LogIn size={16} aria-hidden="true" />
                            Sign In
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <QuickView
                isOpen={!!quickViewProduct}
                onClose={() => setQuickViewProduct(null)}
                onLoginRequired={() => setShowLoginModal(true)}
                product={quickViewProduct}
            />
            <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />

            <h1 className={styles.title}><SplitTextReveal text="My Wishlist" /></h1>
            <ScrollReveal direction="up" delay={150}>
                <p className={styles.subtitle}>
                    {wishlistItems.length === 0
                        ? 'Nothing saved yet'
                        : `${wishlistItems.length} ${wishlistItems.length === 1 ? 'piece' : 'pieces'} saved for later`}
                </p>
            </ScrollReveal>

            <AnimatePresence mode="wait">
                {wishlistItems.length === 0 ? (
                    <motion.div
                        key="empty"
                        className={styles.emptyState}
                        initial={{ opacity: 0, y: 24, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={spring.gentle}
                    >
                        <motion.span
                            className={styles.emptyIcon}
                            initial={{ scale: 0.6, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ ...spring.seal, delay: 0.1 }}
                            aria-hidden="true"
                        >
                            <Heart size={28} strokeWidth={1.8} />
                        </motion.span>
                        <h2 className={styles.emptyTitle}>Your wishlist is empty</h2>
                        <p className={styles.emptyText}>
                            Tap the heart on any product to keep it here for later.
                        </p>
                        <motion.div whileTap={{ scale: 0.97 }} transition={spring.press}>
                            <Link href="/shop" className={styles.button}>
                                Start Shopping
                                <ArrowRight size={16} aria-hidden="true" />
                            </Link>
                        </motion.div>
                    </motion.div>
                ) : (
                    <StaggerGrid key="grid" className={styles.grid}>
                        <AnimatePresence initial={false}>
                            {wishlistItems.map((item) => (
                                <motion.div
                                    key={item.id}
                                    className={styles.wishlistItem}
                                    layout
                                    exit={{ opacity: 0, scale: 0.92, y: 12 }}
                                    transition={spring.gentle}
                                >
                                    <ProductCard
                                        {...item}
                                        onQuickView={() => setQuickViewProduct(item)}
                                    />
                                    <motion.button
                                        className={styles.removeBtn}
                                        onClick={() => removeFromWishlist(item.id)}
                                        whileTap={{ scale: 0.96 }}
                                        transition={spring.press}
                                        aria-label={`Remove ${item.name} from wishlist`}
                                    >
                                        Remove
                                    </motion.button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </StaggerGrid>
                )}
            </AnimatePresence>
        </div>
    );
}
