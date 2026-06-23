'use client';

import React, { useState, useEffect, useMemo } from 'react';
import styles from './page.module.css';
import ProductCard from '@/components/ui/ProductCard';
import QuickView from '@/components/ui/QuickView';
import LoginModal from '@/components/ui/LoginModal';
import type { Product } from '@/lib/data';

const categories = ['All', 'T-Shirts', 'Bottoms', 'Hoodies', 'Accessories', 'Outerwear'];
const sizesList = ['S', 'M', 'L', 'XL', 'XXL', '30', '32', '34', '36', 'One Size'];

export default function Shop() {
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('All');
    const [priceRange, setPriceRange] = useState(2000);
    const [selectedSize, setSelectedSize] = useState('');
    const [sortBy, setSortBy] = useState('featured');
    const [searchQuery, setSearchQuery] = useState('');
    const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
    const [showLoginModal, setShowLoginModal] = useState(false);

    // Initial check for category or maxPrice from URL query search parameters
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const cat = params.get('category');
            if (cat) {
                const found = categories.find(c => c.toLowerCase() === cat.toLowerCase());
                if (found) setActiveCategory(found);
            }
            const maxP = params.get('maxPrice');
            if (maxP) {
                const num = Number(maxP);
                if (!isNaN(num)) setPriceRange(num);
            }
        }
    }, []);

    // Fetch base products filtered by category and price range from the API
    useEffect(() => {
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

    // Client-side filtering and sorting
    const processedProducts = useMemo(() => {
        let result = [...allProducts];

        // 1. Search Query Filter
        if (searchQuery.trim() !== '') {
            const query = searchQuery.toLowerCase();
            result = result.filter(p =>
                p.name.toLowerCase().includes(query) ||
                p.description.toLowerCase().includes(query) ||
                p.category.toLowerCase().includes(query)
            );
        }

        // 2. Size Filter
        if (selectedSize !== '') {
            result = result.filter(p => p.sizes && p.sizes.includes(selectedSize));
        }

        // 3. Sorting Logic
        if (sortBy === 'price-asc') {
            result.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'price-desc') {
            result.sort((a, b) => b.price - a.price);
        } else if (sortBy === 'newest') {
            result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        } else if (sortBy === 'rating') {
            const getAvgRating = (p: Product) => {
                if (!p.reviews || p.reviews.length === 0) return 0;
                return p.reviews.reduce((acc, r) => acc + r.rating, 0) / p.reviews.length;
            };
            result.sort((a, b) => getAvgRating(b) - getAvgRating(a));
        }

        return result;
    }, [allProducts, searchQuery, selectedSize, sortBy]);

    const handleClearFilters = () => {
        setActiveCategory('All');
        setPriceRange(2000);
        setSelectedSize('');
        setSortBy('featured');
        setSearchQuery('');
    };

    const hasActiveFilters = activeCategory !== 'All' || priceRange !== 2000 || selectedSize !== '' || searchQuery !== '' || sortBy !== 'featured';

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
                <div>
                    <h1 className={styles.title}>EXPLORE THE DROP</h1>
                </div>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <p className={styles.count}>{processedProducts.length} items found</p>
                    <select
                        className={styles.sortSelect}
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="featured">Sort: Featured</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                        <option value="newest">Newest Drops</option>
                        <option value="rating">Highest Rated</option>
                    </select>
                </div>
            </header>

            <div className={styles.shopLayout}>
                <aside className={styles.sidebar}>
                    <div className={styles.searchGroup}>
                        <h3>Search</h3>
                        <input
                            type="text"
                            placeholder="Search drops..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={styles.searchInput}
                        />
                    </div>

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
                            {sizesList.map(s => (
                                <button
                                    key={s}
                                    className={`${styles.sizeBtn} ${selectedSize === s ? styles.sizeActive : ''}`}
                                    onClick={() => setSelectedSize(selectedSize === s ? '' : s)}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    {hasActiveFilters && (
                        <button onClick={handleClearFilters} className={styles.clearFiltersBtn}>
                            Clear Filters
                        </button>
                    )}
                </aside>

                <main className={styles.productGrid}>
                    {loading ? (
                        <div className={styles.loading}>Loading newest drops...</div>
                    ) : processedProducts.length === 0 ? (
                        <div className={styles.emptyState}>
                            <h2>No products match your search/filters</h2>
                            <p>Try resetting the filters or typing a different search term.</p>
                        </div>
                    ) : (
                        processedProducts.map(p => (
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
