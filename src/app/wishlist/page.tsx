'use client';

import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import { useAuth } from '@/lib/AuthContext';
import Link from 'next/link';
import ProductCard from '@/components/ui/ProductCard';
import QuickView from '@/components/ui/QuickView';
import LoginModal from '@/components/ui/LoginModal';

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
        // Load wishlist from localStorage
        const saved = localStorage.getItem('gravity-wishlist');
        if (saved) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setWishlistItems(JSON.parse(saved));
        } else {
            // Add some demo items if empty
            const demoItems: Product[] = [
                {
                    id: '1',
                    name: 'Oversized Graffiti Tee',
                    price: 699,
                    originalPrice: 1299,
                    imageUrl: '/product1.png',
                    category: 'T-SHIRTS',
                },
                {
                    id: '3',
                    name: 'Classic Logo Hoodie',
                    price: 1199,
                    originalPrice: 1999,
                    imageUrl: '/product3.png',
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
                    <h1>❤️ My Wishlist</h1>
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

            <h1 className={styles.title}>❤️ My Wishlist</h1>
            <p className={styles.subtitle}>{wishlistItems.length} items saved for later</p>

            {wishlistItems.length === 0 ? (
                <div className={styles.emptyState}>
                    <p>Your wishlist is empty</p>
                    <Link href="/shop" className={styles.button}>
                        Start Shopping
                    </Link>
                </div>
            ) : (
                <div className={styles.grid}>
                    {wishlistItems.map((item) => (
                        <div key={item.id} className={styles.wishlistItem}>
                            <ProductCard
                                {...item}
                                onQuickView={() => setQuickViewProduct(item)}
                            />
                            <button
                                className={styles.removeBtn}
                                onClick={() => removeFromWishlist(item.id)}
                            >
                                Remove ✕
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
