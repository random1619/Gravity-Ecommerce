'use client';

import React, { useState } from 'react';
import styles from './page.module.css';
import ProductCard from '@/components/ui/ProductCard';
import QuickView from '@/components/ui/QuickView';
import LoginModal from '@/components/ui/LoginModal';
import type { Product } from '@/lib/data';

const categories = ['All', 'T-Shirts', 'Bottoms', 'Hoodies', 'Accessories', 'Outerwear'];

export default function Shop() {
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('All');
    const [priceRange, setPriceRange] = useState(2000);
    const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
    const [showLoginModal, setShowLoginModal] = useState(false);

    React.useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/products?category=${activeCategory === 'All' ? '' : activeCategory}&maxPrice=${priceRange}`);
                const data = (await response.json()) as Product[];
                setAllProducts(data);
            } catch (error) {
                console.error('Failed to fetch products:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [activeCategory, priceRange]);

    const filteredProducts = allProducts;

    return (
        <div className={`container ${styles.shopPage}`}>
            <QuickView
                isOpen={!!quickViewProduct}
                onClose={() => setQuickViewProduct(null)}
                onLoginRequired={() => setShowLoginModal(true)}
                product={quickViewProduct}
            />
            <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
            <header className={styles.shopHeader}>
                <h1 className={styles.title}>EXPLORE THE DROP</h1>
                <p className={styles.count}>{filteredProducts.length} items found</p>
            </header>

            <div className={styles.shopLayout}>
                <aside className={styles.sidebar}>
                    <div className={styles.filterGroup}>
                        <h3>Category</h3>
                        <div className={styles.categoryList}>
                            {categories.map((cat: string) => (
                                <button
                                    key={cat}
                                    className={`${styles.filterBtn} ${activeCategory === cat ? styles.active : ''}`}
                                    onClick={() => setActiveCategory(cat)}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className={styles.filterGroup}>
                        <h3>Price Range</h3>
                        <div className={styles.priceFilter}>
                            <input
                                type="range"
                                min="0"
                                max="2000"
                                step="100"
                                value={priceRange}
                                onChange={(e) => setPriceRange(Number(e.target.value))}
                                className={styles.rangeInput}
                            />
                            <div className={styles.priceScale}>
                                <span>₹0</span>
                                <span>₹{priceRange}</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.filterGroup}>
                        <h3>Size</h3>
                        <div className={styles.sizeGrid}>
                            {['S', 'M', 'L', 'XL', 'XXL'].map(s => <button key={s} className={styles.sizeBtn}>{s}</button>)}
                        </div>
                    </div>
                </aside>

                <main className={styles.productGrid}>
                    {loading ? (
                        <div className={styles.loading}>Loading newest drops...</div>
                    ) : (
                        filteredProducts.map(p => (
                            <ProductCard
                                key={p.id}
                                {...p}
                                onQuickView={() => setQuickViewProduct(p)}
                            />
                        ))
                    )}
                </main>
            </div>
        </div>
    );
}
