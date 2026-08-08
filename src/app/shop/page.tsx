'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { LayoutGrid, Grid2x2, Grid3x3, X, ArrowUp, SlidersHorizontal } from 'lucide-react';
import styles from './page.module.css';
import ProductCard from '@/components/ui/ProductCard';
import QuickView from '@/components/ui/QuickView';
import LoginModal from '@/components/ui/LoginModal';
import StaggerGrid from '@/components/motion/StaggerGrid';
import { getRecentlyViewed, type RecentProduct } from '@/lib/recentlyViewed';
import type { Product } from '@/lib/data';

const categories = ['All', 'T-Shirts', 'Bottoms', 'Hoodies', 'Accessories', 'Outerwear'];
const sizesList = ['S', 'M', 'L', 'XL', 'XXL', '30', '32', '34', '36', 'One Size'];

type Density = 2 | 3 | 4;

export default function Shop() {
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
    const [catalog, setCatalog] = useState<Product[]>([]);
    const [newCount, setNewCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('All');
    const [priceRange, setPriceRange] = useState(2000);
    const [selectedSize, setSelectedSize] = useState('');
    const [sortBy, setSortBy] = useState('featured');
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [newOnly, setNewOnly] = useState(false);
    const [density, setDensity] = useState<Density>(3);
    const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showTopBtn, setShowTopBtn] = useState(false);
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [recent, setRecent] = useState<RecentProduct[]>([]);
    const searchRef = useRef<HTMLInputElement>(null);

    // Load recently-viewed once on mount; refresh whenever a quick view closes
    useEffect(() => {
        setRecent(getRecentlyViewed());
    }, [quickViewProduct]);

    // Show back-to-top pill after scrolling past the header
    useEffect(() => {
        const onScroll = () => setShowTopBtn(window.scrollY > 600);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Restore full filter state from URL query params on mount
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
            const size = params.get('size');
            if (size && sizesList.includes(size)) setSelectedSize(size);
            const sort = params.get('sort');
            if (sort && ['featured', 'price-asc', 'price-desc', 'newest', 'rating', 'savings'].includes(sort)) setSortBy(sort);
            const q = params.get('q');
            if (q) setSearchQuery(q);
            if (params.get('new') === '1') setNewOnly(true);
            const d = params.get('density');
            if (d === '2' || d === '3' || d === '4') setDensity(Number(d) as Density);
        }
    }, []);

    // Sync filter state back to the URL (shareable / survives refresh)
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const params = new URLSearchParams();
        if (activeCategory !== 'All') params.set('category', activeCategory);
        if (priceRange !== 2000) params.set('maxPrice', String(priceRange));
        if (selectedSize) params.set('size', selectedSize);
        if (sortBy !== 'featured') params.set('sort', sortBy);
        if (searchQuery.trim()) params.set('q', searchQuery.trim());
        if (newOnly) params.set('new', '1');
        if (density !== 3) params.set('density', String(density));
        const qs = params.toString();
        const url = qs ? `${window.location.pathname}?${qs}` : window.location.pathname;
        window.history.replaceState(null, '', url);
    }, [activeCategory, priceRange, selectedSize, sortBy, searchQuery, newOnly, density]);

    // Debounce the query applied to filtering so typing doesn't re-stagger
    // the grid on every keystroke
    useEffect(() => {
        const t = setTimeout(() => setDebouncedQuery(searchQuery), 250);
        return () => clearTimeout(t);
    }, [searchQuery]);

    // "/" focuses the search input (standard pattern)
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key !== '/' || e.metaKey || e.ctrlKey || e.altKey) return;
            const target = e.target as HTMLElement | null;
            if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;
            e.preventDefault();
            searchRef.current?.focus();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    // One unfiltered fetch on mount to derive per-category counts
    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const res = await fetch('/api/products');
                const data: unknown = res.ok ? await res.json() : [];
                if (!Array.isArray(data)) return;
                const counts: Record<string, number> = { All: data.length };
                let fresh = 0;
                for (const p of data as Product[]) {
                    counts[p.category] = (counts[p.category] || 0) + 1;
                    if (p.isNew) fresh++;
                }
                setCategoryCounts(counts);
                setNewCount(fresh);
                setCatalog(data as Product[]);
            } catch {
                // counts are a nice-to-have; ignore failures
            }
        };
        fetchCounts();
    }, []);

    // Fetch base products filtered by category and price range from the API
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/products?category=${activeCategory === 'All' ? '' : activeCategory}&maxPrice=${priceRange}`);
                const data: unknown = response.ok ? await response.json() : [];
                setAllProducts(Array.isArray(data) ? data : []);
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

        // 1. Search Query Filter (debounced)
        if (debouncedQuery.trim() !== '') {
            const query = debouncedQuery.toLowerCase();
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

        // 2b. New-only filter
        if (newOnly) {
            result = result.filter(p => p.isNew);
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
        } else if (sortBy === 'savings') {
            result.sort((a, b) => (b.originalPrice - b.price) - (a.originalPrice - a.price));
        }

        return result;
    }, [allProducts, debouncedQuery, selectedSize, sortBy, newOnly]);

    const handleClearFilters = () => {
        setActiveCategory('All');
        setPriceRange(2000);
        setSelectedSize('');
        setSortBy('featured');
        setSearchQuery('');
        setNewOnly(false);
    };

    const hasActiveFilters = activeCategory !== 'All' || priceRange !== 2000 || selectedSize !== '' || searchQuery !== '' || sortBy !== 'featured' || newOnly;

    const resultWord = processedProducts.length === 1 ? 'piece' : 'pieces';

    // Live-data ticker phrases for the archive strip
    const totalPieces = categoryCounts['All'] ?? 0;
    const tickerPhrases: string[] = [
        'AW \'26 Archive',
        totalPieces > 0 ? `${totalPieces} pieces indexed` : 'Indexing the archive',
        newCount > 0 ? `${newCount} new this season` : 'Fresh drops weekly',
        'Free shipping over ₹1499',
        'Student discount live',
    ];
    const tickerItems = [...tickerPhrases, ...tickerPhrases];

    // Dismissible chips for each active filter
    const chips: { key: string; label: string; clear: () => void }[] = [];
    if (activeCategory !== 'All') chips.push({ key: 'cat', label: activeCategory, clear: () => setActiveCategory('All') });
    if (selectedSize) chips.push({ key: 'size', label: `Size ${selectedSize}`, clear: () => setSelectedSize('') });
    if (priceRange !== 2000) chips.push({ key: 'price', label: `Under ₹${priceRange}`, clear: () => setPriceRange(2000) });
    if (searchQuery.trim()) chips.push({ key: 'search', label: `"${searchQuery.trim()}"`, clear: () => setSearchQuery('') });
    if (newOnly) chips.push({ key: 'new', label: 'New only', clear: () => setNewOnly(false) });
    if (sortBy !== 'featured') {
        const sortLabels: Record<string, string> = {
            'price-asc': 'Price ↑',
            'price-desc': 'Price ↓',
            newest: 'Newest',
            rating: 'Top rated',
            savings: 'Big savings',
        };
        chips.push({ key: 'sort', label: sortLabels[sortBy] || sortBy, clear: () => setSortBy('featured') });
    }

    // Single-glance recap of the active query, under the header count
    const recapParts: string[] = [];
    if (activeCategory !== 'All') recapParts.push(activeCategory);
    if (selectedSize) recapParts.push(`size ${selectedSize}`);
    if (priceRange !== 2000) recapParts.push(`under ₹${priceRange}`);
    if (searchQuery.trim()) recapParts.push(`"${searchQuery.trim()}"`);
    const recap = recapParts.join(' + ');

    // Sizes that at least one currently-loaded product offers
    const availableSizes = useMemo(() => {
        const set = new Set<string>();
        for (const p of allProducts) {
            (p.sizes || []).forEach(s => set.add(s));
        }
        return set;
    }, [allProducts]);

    // Price distribution across the full catalog, bucketed for the histogram
    const priceHistogram = useMemo(() => {
        const BUCKETS = 10;
        const MAX = 2000;
        const STEP = MAX / BUCKETS;
        const counts = new Array(BUCKETS).fill(0);
        for (const p of catalog) {
            const idx = Math.min(BUCKETS - 1, Math.floor(p.price / STEP));
            counts[idx]++;
        }
        const peak = Math.max(1, ...counts);
        return counts.map((count, i) => ({
            ratio: count / peak,
            inRange: (i + 1) * STEP <= priceRange || priceRange >= MAX,
        }));
    }, [catalog, priceRange]);

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
                <div className={styles.headerMeta}>
                    <span className={styles.headerKicker}>The Drop Index</span>
                    <span className={styles.headerSeason}>AW '26 · Full Archive</span>
                    {newCount > 0 && (
                        <span className={styles.headerNew}>{newCount} new this season</span>
                    )}
                </div>
                <h1 className={styles.title}>
                    <span className={styles.titleSolid}>Explore</span>
                    <span className={styles.titleOutline}>The Drop</span>
                </h1>
                <div className={styles.headerBar}>
                    <p className={styles.count}>
                        <span key={processedProducts.length} className={styles.countNumber}>{processedProducts.length}</span>
                        {loading ? 'loading…' : `${resultWord} in the archive`}
                        {recap && <span className={styles.countRecap}>filtered by {recap}</span>}
                    </p>
                    <div className={styles.headerControls}>
                        <div className={styles.densityToggle} role="group" aria-label="Grid density">
                            {([2, 3, 4] as Density[]).map((d) => (
                                <button
                                    key={d}
                                    className={`${styles.densityBtn} ${density === d ? styles.densityActive : ''}`}
                                    onClick={() => setDensity(d)}
                                    aria-label={`${d} columns`}
                                    aria-pressed={density === d}
                                >
                                    {d === 2 ? <Grid2x2 size={15} /> : d === 3 ? <Grid3x3 size={15} /> : <LayoutGrid size={15} />}
                                </button>
                            ))}
                        </div>
                        <select
                            className={styles.sortSelect}
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            aria-label="Sort products"
                        >
                            <option value="featured">Sort: Featured</option>
                            <option value="price-asc">Price: Low to High</option>
                            <option value="price-desc">Price: High to Low</option>
                            <option value="newest">Newest Drops</option>
                            <option value="rating">Highest Rated</option>
                            <option value="savings">Biggest Savings</option>
                        </select>
                    </div>
                </div>
            </header>

            <div className={styles.ticker} aria-hidden="true">
                <div className={styles.tickerTrack}>
                    {tickerItems.map((phrase, i) => (
                        <span key={i} className={styles.tickerItem}>
                            {phrase}
                            <span className={styles.tickerDot}>•</span>
                        </span>
                    ))}
                </div>
            </div>

            {/* Screen-reader announcements for result changes */}
            <p className={styles.srOnly} role="status" aria-live="polite">
                {loading ? 'Loading products' : `${processedProducts.length} ${resultWord} found`}
            </p>

            <button
                className={styles.filtersToggle}
                onClick={() => setFiltersOpen(o => !o)}
                aria-expanded={filtersOpen}
                aria-controls="shop-sidebar"
            >
                <SlidersHorizontal size={14} />
                Filters
                {hasActiveFilters && <span className={styles.filtersToggleDot} aria-hidden="true" />}
            </button>

            <div className={styles.shopLayout}>
                <aside id="shop-sidebar" className={`${styles.sidebar} ${filtersOpen ? styles.sidebarOpen : ''}`}>
                    <div className={styles.sidebarHead}>
                        <span className={styles.sidebarIndex}>Index</span>
                        {hasActiveFilters && (
                            <button onClick={handleClearFilters} className={styles.clearFiltersBtn}>
                                Reset
                            </button>
                        )}
                    </div>

                    <div className={styles.searchGroup}>
                        <h2 className={styles.groupLabel}>Search</h2>
                        <div className={styles.searchWrap}>
                            <input
                                ref={searchRef}
                                type="text"
                                placeholder="Search drops..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Escape' && searchQuery) {
                                        setSearchQuery('');
                                        e.currentTarget.blur();
                                    }
                                }}
                                className={styles.searchInput}
                            />
                            <kbd className={styles.searchKbd}>/</kbd>
                        </div>
                    </div>

                    <div className={styles.filterGroup}>
                        <h2 className={styles.groupLabel}>Category</h2>
                        <div className={styles.categoryList}>
                            {categories.map((cat: string, i: number) => (
                                <button
                                    key={cat}
                                    className={`${styles.filterBtn} ${activeCategory === cat ? styles.active : ''}`}
                                    onClick={() => setActiveCategory(cat)}
                                >
                                    <span className={styles.filterNum}>{String(i + 1).padStart(2, '0')}</span>
                                    <span className={styles.filterName}>{cat}</span>
                                    {categoryCounts[cat] !== undefined && (
                                        <span className={styles.filterCount}>{categoryCounts[cat]}</span>
                                    )}
                                    {activeCategory !== cat && categoryCounts[cat] !== undefined && categoryCounts[cat] > 0 && (
                                        <span className={styles.filterHint}>→ {categoryCounts[cat]} {categoryCounts[cat] === 1 ? 'piece' : 'pieces'}</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className={styles.filterGroup}>
                        <h2 className={styles.groupLabel}>Availability</h2>
                        <button
                            className={`${styles.newOnlyToggle} ${newOnly ? styles.newOnlyActive : ''}`}
                            onClick={() => setNewOnly(o => !o)}
                            aria-pressed={newOnly}
                        >
                            <span className={styles.newOnlyDot} aria-hidden="true" />
                            New drops only
                        </button>
                    </div>

                    <div className={styles.filterGroup}>
                        <h2 className={styles.groupLabel}>Max Price</h2>
                        <div className={styles.priceFilter}>
                            {priceHistogram.some(b => b.ratio > 0) && (
                                <div className={styles.histogram} aria-hidden="true">
                                    {priceHistogram.map((bar, i) => (
                                        <span
                                            key={i}
                                            className={`${styles.histogramBar} ${bar.inRange ? '' : styles.histogramBarDim}`}
                                            style={{ height: `${Math.max(6, bar.ratio * 100)}%` }}
                                        />
                                    ))}
                                </div>
                            )}
                            <input
                                type="range"
                                min="0"
                                max="2000"
                                step="100"
                                value={priceRange}
                                onChange={(e) => setPriceRange(Number(e.target.value))}
                                className={styles.rangeInput}
                                style={{ '--fill': `${(priceRange / 2000) * 100}%` } as React.CSSProperties}
                                aria-label="Maximum price"
                            />
                            <div className={styles.priceScale}>
                                <span>₹0</span>
                                <span className={styles.priceValue}>₹{priceRange}</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.filterGroup}>
                        <h2 className={styles.groupLabel}>Size</h2>
                        <div className={styles.sizeGrid}>
                            {sizesList.map(s => {
                                const unavailable = !loading && availableSizes.size > 0 && !availableSizes.has(s);
                                return (
                                    <button
                                        key={s}
                                        className={`${styles.sizeBtn} ${selectedSize === s ? styles.sizeActive : ''} ${unavailable ? styles.sizeUnavailable : ''}`}
                                        onClick={() => setSelectedSize(selectedSize === s ? '' : s)}
                                        disabled={unavailable}
                                        title={unavailable ? 'Not available in the current selection' : undefined}
                                    >
                                        {s}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </aside>

                <main className={styles.productGrid} data-density={density}>
                    <span className={styles.gridMarker} aria-hidden="true">AW'26 · Index</span>
                    {chips.length > 0 && (
                        <div className={styles.chipRow}>
                            {chips.map(chip => (
                                <button key={chip.key} className={styles.chip} onClick={chip.clear}>
                                    {chip.label}
                                    <X size={12} />
                                </button>
                            ))}
                            <button className={styles.chipClearAll} onClick={handleClearFilters}>
                                Clear all
                            </button>
                        </div>
                    )}
                    {loading ? (
                        <div className={styles.skeletonGrid} style={{ gridTemplateColumns: `repeat(${density}, 1fr)` }}>
                            {Array.from({ length: density * 2 }).map((_, i) => (
                                <div key={i} className={styles.skeletonCard}>
                                    <div className={styles.skeletonImage} />
                                    <div className={styles.skeletonLine} style={{ width: '40%' }} />
                                    <div className={styles.skeletonLine} style={{ width: '80%' }} />
                                    <div className={styles.skeletonLine} style={{ width: '55%' }} />
                                </div>
                            ))}
                        </div>
                    ) : processedProducts.length === 0 ? (
                        <div className={styles.emptyState}>
                            <span className={styles.emptyGlyph}>∅</span>
                            <h2>Nothing in the archive matches</h2>
                            <p>Loosen a filter or try a different search term.</p>
                            {hasActiveFilters && (
                                <button onClick={handleClearFilters} className={styles.emptyReset}>
                                    Reset all filters
                                </button>
                            )}
                            {catalog.length > 0 && (
                                <div className={styles.emptySuggest}>
                                    <span className={styles.emptySuggestLabel}>Or start with these</span>
                                    <div className={styles.emptySuggestRow}>
                                        {catalog.slice(0, 4).map(p => (
                                            <Link key={p.id} href={`/product/${p.id}`} className={styles.suggestCard}>
                                                <span className={styles.suggestImageWrap}>
                                                    <Image
                                                        src={p.imageUrl}
                                                        alt={p.name}
                                                        fill
                                                        sizes="100px"
                                                        className={styles.suggestImage}
                                                    />
                                                </span>
                                                <span className={styles.suggestName}>{p.name}</span>
                                                <span className={styles.suggestPrice}>₹{p.price}</span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <StaggerGrid
                            key={`${activeCategory}-${priceRange}-${selectedSize}-${sortBy}-${debouncedQuery}-${density}`}
                            className={styles.productGridInner}
                            style={{ gridTemplateColumns: `repeat(${density}, 1fr)` }}
                        >
                            {processedProducts.map(p => (
                                <ProductCard
                                    key={p.id}
                                    {...p}
                                    onQuickView={() => setQuickViewProduct(p)}
                                />
                            ))}
                        </StaggerGrid>
                    )}
                </main>
            </div>

            {recent.length > 0 && (
                <section className={styles.recentSection} aria-label="Recently viewed">
                    <div className={styles.recentHead}>
                        <span className={styles.recentIndex}>Recap</span>
                        <h2 className={styles.recentTitle}>Recently viewed</h2>
                    </div>
                    <div className={styles.recentRail}>
                        {recent.map(p => (
                            <Link key={p.id} href={`/product/${p.id}`} className={styles.recentCard}>
                                <span className={styles.recentImageWrap}>
                                    <Image
                                        src={p.imageUrl}
                                        alt={p.name}
                                        fill
                                        sizes="120px"
                                        className={styles.recentImage}
                                    />
                                </span>
                                <span className={styles.recentMeta}>
                                    <span className={styles.recentName}>{p.name}</span>
                                    <span className={styles.recentPrice}>₹{p.price}</span>
                                </span>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            <button
                className={`${styles.topBtn} ${showTopBtn ? styles.topBtnVisible : ''}`}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                aria-label="Back to top"
                tabIndex={showTopBtn ? 0 : -1}
            >
                <ArrowUp size={13} /> Top
            </button>
        </div>
    );
}
