'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './page.module.css';

/** Kowalski press spring for the row actions. */
const spring = { type: 'spring', stiffness: 500, damping: 30, mass: 0.5 } as const;
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
                <div className={styles.emptyState}>
                    <h1>My Wishlist</h1>
                    <p>Please login to view your wishlist</p>
                    <Link href="/" className={styles.button}>
                        Go to Home
                    </Link>
                </div>
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
                <p className={styles.subtitle}>{wishlistItems.length} items saved for later</p>
            </ScrollReveal>

            {wishlistItems.length === 0 ? (
                <div className={styles.emptyState}>
                    <p>Your wishlist is empty</p>
                    <Link href="/shop" className={styles.button}>
                        Start Shopping
                    </Link>
                </div>
            ) : (
                <StaggerGrid className={styles.grid}>
                    {wishlistItems.map((item) => (
                        <div key={item.id} className={styles.wishlistItem}>
                            <ProductCard
                                {...item}
                                onQuickView={() => setQuickViewProduct(item)}
                            />
                            <motion.button
                                className={styles.removeBtn}
                                onClick={() => removeFromWishlist(item.id)}
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.94 }}
                                transition={spring}
                            >
                                Remove
                            </motion.button>
                        </div>
                    ))}
                </StaggerGrid>
            )}
        </div>
    );
}
