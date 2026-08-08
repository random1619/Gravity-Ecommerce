'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';
import Button from '../ui/Button';
import { useTheme } from '@/lib/ThemeContext';
import { useCart } from '@/lib/CartContext';
import { useAuth } from '@/lib/AuthContext';
import LoginModal from '../ui/LoginModal';
import {
    motion,
    AnimatePresence,
    useReducedMotion,
    useScroll,
    useSpring,
} from 'framer-motion';
import {
    Sun,
    Moon,
    ShoppingBag,
    User,
    ChevronDown,
    Package,
    Heart,
    Settings,
    LogOut,
    Search,
    Menu,
    X,
    CornerDownLeft,
} from 'lucide-react';
import type { Product } from '@/lib/data';

/* The bag is a dedicated page (/cart), not an overlay — the navbar bag links
   to it. MotionLink keeps the press/hover spring physics on a Next Link. */
const MotionLink = motion.create(Link);

/* Primary nav stays at four links: shop, drops, lookbook, and the student
   offer (the money promise). Rewards is secondary — it lives in the mobile
   drawer's utility section and the footer. */
const NAV_LINKS = [
    { href: '/shop', label: 'Shop' },
    { href: '/collections', label: 'New Drops' },
    { href: '/lookbook', label: 'Lookbook' },
    { href: '/discount', label: 'Student Offer' },
];

/* ------------------------------------------------------------------
   Emil Kowalski spring presets — physics, not durations.
   snappy: small UI responses (hover, tap, pills)
   gentle: larger surface moves (the bar condensing, palette morph)
   bouncy: playful one-shots (cart badge pop)
------------------------------------------------------------------- */
const spring = {
    snappy: { type: 'spring', stiffness: 500, damping: 35, mass: 0.6 },
    gentle: { type: 'spring', stiffness: 210, damping: 26, mass: 0.9 },
    bouncy: { type: 'spring', stiffness: 600, damping: 20, mass: 0.5 },
} as const;

/* Icon micro-variants — transform/opacity only, spring-driven */
const iconVariants = {
    rest: { y: 0, rotate: 0, scale: 1 },
    hover: { y: -2, scale: 1.12 },
    tap: { scale: 0.88 },
};

const bagVariants = {
    rest: { y: 0, rotate: 0 },
    hover: { y: [0, -3, 0], rotate: [0, -8, 0] },
};

const Navbar = () => {
    const { theme, toggleTheme } = useTheme();
    const { cartCount } = useCart();
    const { user, logout, isAuthenticated } = useAuth();
    const [search, setSearch] = useState('');
    const [trends, setTrends] = useState<string[]>([]);
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [hoveredLink, setHoveredLink] = useState<string | null>(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [pressed, setPressed] = useState(false);
    const shouldReduceMotion = useReducedMotion();
    const pathname = usePathname();
    const searchInputRef = useRef<HTMLInputElement>(null);
    const searchTriggerRef = useRef<HTMLButtonElement>(null);

    // Hydration-safe mount gate
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    const reduceMotion = !mounted || shouldReduceMotion;

    // Reading-progress hairline — spring-smoothed
    const { scrollYProgress } = useScroll();
    const progressScale = useSpring(scrollYProgress, {
        stiffness: 120,
        damping: 30,
        mass: 0.4,
    });

    // Floating-island trigger
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        const fetchTrends = async () => {
            try {
                const res = await fetch('/api/products');
                const products: unknown = res.ok ? await res.json() : [];
                if (!Array.isArray(products)) return;
                setAllProducts(products);
                const uniqueCategories = Array.from(
                    new Set(products.map((p: Product) => p.category))
                ) as string[];
                setTrends([...uniqueCategories, 'Oversized', 'Streetwear', 'New Drops']);
            } catch (err) {
                console.error('Failed to fetch trends', err);
            }
        };
        fetchTrends();
    }, []);

    // Close transient menus on route change
    useEffect(() => {
        setMobileOpen(false);
        setShowUserDropdown(false);
        setIsSearchOpen(false);
    }, [pathname]);

    // Autofocus the palette input once the morph lands
    useEffect(() => {
        if (isSearchOpen) {
            const t = setTimeout(() => searchInputRef.current?.focus(), 60);
            return () => clearTimeout(t);
        }
    }, [isSearchOpen]);

    const filteredTrends = trends.filter((trend) =>
        trend.toLowerCase().includes(search.toLowerCase())
    );
    const matchingProducts = allProducts.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                setIsSearchOpen((prev) => !prev);
            }
            if (e.key === 'Escape') {
                setIsSearchOpen(false);
                setMobileOpen(false);
                setShowUserDropdown(false);
                searchTriggerRef.current?.focus();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const userMenu = document.querySelector(`.${styles.userMenu}`);
            if (userMenu && !userMenu.contains(event.target as Node)) {
                setShowUserDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const closeSearch = () => {
        setIsSearchOpen(false);
        setSearch('');
        searchTriggerRef.current?.focus();
    };

    return (
        <motion.header
            className={styles.navbar}
            initial={mounted && !reduceMotion ? { y: -72, opacity: 0 } : false}
            animate={{ y: 0, opacity: 1 }}
            transition={spring.gentle}
        >
            {/* Reading-progress hairline */}
            {!reduceMotion && (
                <motion.span
                    className={styles.scrollProgress}
                    style={{ scaleX: progressScale }}
                    aria-hidden="true"
                />
            )}

            {/* The island — scaleY morph, transform-only, no layout thrash */}
            <motion.div
                className={`${styles.island} ${scrolled ? styles.islandScrolled : ''}`}
                initial={false}
                animate={{ scaleY: scrolled ? 0.84 : 1 }}
                transition={spring.gentle}
                style={{ originY: 0.5 }}
            >
                <motion.div
                    className={`container ${styles.navContainer}`}
                    initial={false}
                    animate={{ scaleY: scrolled ? 1 / 0.84 : 1 }}
                    transition={spring.gentle}
                >
                    {/* Logo — layout-animated so the font-size swap re-flows, never snaps */}
                    <motion.div layout={reduceMotion ? false : 'position'} transition={spring.snappy}>
                        <Link
                            href="/"
                            className={`${styles.logo} ${scrolled ? styles.logoSmall : ''}`}
                        >
                            GRAVITY<span className={styles.logoDot}>.</span>
                        </Link>
                    </motion.div>

                    {/* Desktop links — shared pill chases the cursor */}
                    <div className={styles.links} onMouseLeave={() => setHoveredLink(null)}>
                        {NAV_LINKS.map(({ href, label }) => {
                            const isActive = pathname === href || pathname.startsWith(href + '/');
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    className={`${styles.link} ${isActive ? styles.linkActive : ''}`}
                                    aria-current={isActive ? 'page' : undefined}
                                    onMouseEnter={() => setHoveredLink(href)}
                                >
                                    {isActive && (
                                        <motion.span
                                            className={styles.linkPill}
                                            layoutId={reduceMotion ? undefined : 'nav-active-pill'}
                                            transition={spring.snappy}
                                        />
                                    )}
                                    {hoveredLink === href && !isActive && (
                                        <motion.span
                                            className={styles.linkPillHover}
                                            layoutId={reduceMotion ? undefined : 'nav-hover-pill'}
                                            transition={spring.snappy}
                                        />
                                    )}
                                    <span className={styles.linkLabel}>{label}</span>
                                </Link>
                            );
                        })}
                    </div>

                    <div className={styles.actions}>
                        {/* Search trigger — morphs INTO the palette via shared layoutId */}
                        {!isSearchOpen && (
                            <motion.button
                                ref={searchTriggerRef}
                                className={styles.searchTrigger}
                                layoutId={reduceMotion ? undefined : 'nav-search-surface'}
                                transition={spring.gentle}
                                onClick={() => setIsSearchOpen(true)}
                                aria-haspopup="dialog"
                                whileTap={reduceMotion ? undefined : { scale: 0.96 }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        setPressed(true);
                                    }
                                }}
                                onKeyUp={() => setPressed(false)}
                                onBlur={() => setPressed(false)}
                                animate={pressed ? { scale: 0.96 } : { scale: 1 }}
                            >
                                {/* Accessible name comes from the sr-only node below so it can
                                    carry the FULL visible label ("Search… ⌘K") — axe requires the
                                    name to contain the visible text, and aria-hidden on the kbd
                                    doesn't remove it from that computation. */}
                                <span className="sr-only">Search… ⌘K</span>
                                <span aria-hidden="true" style={{ display: 'contents' }}>
                                    <Search size={15} className={styles.searchIcon} />
                                    <span className={styles.searchPlaceholder}>Search…</span>
                                    <span className={styles.kbdGroup}>
                                        <kbd className={styles.kbd}>⌘K</kbd>
                                    </span>
                                </span>
                            </motion.button>
                        )}

                        {/* Theme toggle — sun/moon swap with a spring flip */}
                        <motion.button
                            className={styles.iconBtn}
                            onClick={toggleTheme}
                            aria-label="Toggle theme"
                            initial="rest"
                            whileHover="hover"
                            whileTap="tap"
                            animate="rest"
                        >
                            <AnimatePresence mode="wait" initial={false}>
                                <motion.span
                                    key={theme}
                                    className={styles.iconInner}
                                    variants={iconVariants}
                                    initial={reduceMotion ? 'rest' : { y: 8, opacity: 0, rotate: 40 }}
                                    animate={{ y: 0, opacity: 1, rotate: 0 }}
                                    exit={reduceMotion ? { opacity: 0 } : { y: -8, opacity: 0, rotate: -40 }}
                                    transition={spring.snappy}
                                >
                                    {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                                </motion.span>
                            </AnimatePresence>
                        </motion.button>

                        {/* Cart — a dedicated page (/cart), not an overlay. Bag
                            bounces on hover, badge pops on count change. */}
                        <MotionLink
                            href="/cart"
                            className={styles.iconBtn}
                            aria-label={`Cart, ${cartCount} items`}
                            initial="rest"
                            whileHover="hover"
                            whileTap="tap"
                            animate="rest"
                        >
                            <motion.span className={styles.iconInner} variants={reduceMotion ? undefined : bagVariants} transition={spring.snappy}>
                                <ShoppingBag size={18} />
                                <AnimatePresence mode="popLayout" initial={false}>
                                    {cartCount > 0 && (
                                        <motion.span
                                            key={cartCount}
                                            className={styles.badge}
                                            initial={reduceMotion ? false : { scale: 0.3, y: -4 }}
                                            animate={{ scale: 1, y: 0 }}
                                            exit={{ scale: 0.3, opacity: 0 }}
                                            transition={spring.bouncy}
                                        >
                                            {cartCount}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </motion.span>
                        </MotionLink>

                        {isAuthenticated ? (
                            <div className={styles.userMenu}>
                                <motion.button
                                    className={`${styles.userBtn} ${showUserDropdown ? styles.userBtnOpen : ''}`}
                                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                                    aria-haspopup="menu"
                                    aria-expanded={showUserDropdown}
                                    whileTap={reduceMotion ? undefined : { scale: 0.97 }}
                                    transition={spring.snappy}
                                >
                                    <span className={styles.avatar}>
                                        {user?.name?.trim().charAt(0).toUpperCase() || <User size={14} />}
                                    </span>
                                    <span className={styles.userName}>Hi, {user?.name}</span>
                                    <motion.span
                                        className={styles.chevWrap}
                                        animate={{ rotate: showUserDropdown ? 180 : 0 }}
                                        transition={spring.snappy}
                                    >
                                        <ChevronDown size={14} />
                                    </motion.span>
                                </motion.button>

                                <AnimatePresence>
                                    {showUserDropdown && (
                                        <motion.div
                                            className={styles.userDropdown}
                                            role="menu"
                                            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.97 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.97 }}
                                            transition={spring.snappy}
                                            style={{ originY: 0 }}
                                        >
                                            <div className={styles.dropdownHeader}>
                                                <div className={styles.dropdownAvatar}>
                                                    {user?.name?.trim().charAt(0).toUpperCase() || <User size={18} />}
                                                </div>
                                                <div>
                                                    <p className={styles.dropdownName}>{user?.name}</p>
                                                    <p className={styles.dropdownEmail}>{user?.email}</p>
                                                </div>
                                            </div>
                                            <div className={styles.dropdownDivider} />
                                            <Link href="/profile" className={styles.dropdownItem} onClick={() => setShowUserDropdown(false)}>
                                                <User size={15} /> Profile
                                            </Link>
                                            <Link href="/orders" className={styles.dropdownItem} onClick={() => setShowUserDropdown(false)}>
                                                <Package size={15} /> My Orders
                                            </Link>
                                            <Link href="/wishlist" className={styles.dropdownItem} onClick={() => setShowUserDropdown(false)}>
                                                <Heart size={15} /> Wishlist
                                            </Link>
                                            <Link href="/settings" className={styles.dropdownItem} onClick={() => setShowUserDropdown(false)}>
                                                <Settings size={15} /> Settings
                                            </Link>
                                            <div className={styles.dropdownDivider} />
                                            <button
                                                className={styles.logoutBtn}
                                                onClick={() => { logout(); setShowUserDropdown(false); }}
                                            >
                                                <LogOut size={15} /> Logout
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <motion.div whileTap={reduceMotion ? undefined : { scale: 0.96 }} transition={spring.snappy}>
                                <Button variant="primary" size="sm" onClick={() => setShowLoginModal(true)}>
                                    Login
                                </Button>
                            </motion.div>
                        )}

                        {/* Mobile toggle — springs between menu/X */}
                        <motion.button
                            className={`${styles.iconBtn} ${styles.mobileToggle}`}
                            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                            aria-expanded={mobileOpen}
                            aria-controls="mobile-nav-menu"
                            onClick={() => setMobileOpen((o) => !o)}
                            whileTap={reduceMotion ? undefined : { scale: 0.9 }}
                        >
                            <AnimatePresence mode="wait" initial={false}>
                                <motion.span
                                    key={mobileOpen ? 'close' : 'open'}
                                    className={styles.iconInner}
                                    initial={reduceMotion ? { opacity: 0 } : { rotate: -60, opacity: 0, scale: 0.7 }}
                                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                                    exit={reduceMotion ? { opacity: 0 } : { rotate: 60, opacity: 0, scale: 0.7 }}
                                    transition={spring.snappy}
                                >
                                    {mobileOpen ? <X size={19} /> : <Menu size={19} />}
                                </motion.span>
                            </AnimatePresence>
                        </motion.button>
                    </div>
                </motion.div>

                {/* Mobile menu — height-animated sheet with staggered links */}
                <AnimatePresence>
                    {mobileOpen && (
                        <motion.div
                            id="mobile-nav-menu"
                            className={styles.mobileMenu}
                            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
                            transition={spring.gentle}
                        >
                            <nav className={styles.mobileLinks} aria-label="Mobile navigation">
                                {NAV_LINKS.map(({ href, label }, i) => {
                                    const isActive = pathname === href || pathname.startsWith(href + '/');
                                    return (
                                        <motion.div
                                            key={href}
                                            initial={reduceMotion ? false : { opacity: 0, x: -12 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ ...spring.snappy, delay: 0.04 * i }}
                                        >
                                            <Link
                                                href={href}
                                                className={`${styles.mobileLink} ${isActive ? styles.mobileLinkActive : ''}`}
                                                aria-current={isActive ? 'page' : undefined}
                                                onClick={() => setMobileOpen(false)}
                                            >
                                                {label}
                                            </Link>
                                        </motion.div>
                                    );
                                })}
                            </nav>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />

            {/* Command palette — the SAME surface the trigger morphs into */}
            <AnimatePresence>
                {isSearchOpen && (
                    <>
                        <motion.div
                            className={styles.searchScrim}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.18 }}
                            onClick={closeSearch}
                        />
                        <div className={styles.searchAnchor}>
                            <motion.div
                                className={styles.searchPalette}
                                layoutId={reduceMotion ? undefined : 'nav-search-surface'}
                                transition={spring.gentle}
                                role="dialog"
                                aria-label="Search"
                            >
                                <div className={styles.paletteHeader}>
                                    <Search size={17} className={styles.paletteIcon} />
                                    <input
                                        ref={searchInputRef}
                                        type="text"
                                        placeholder="Search products, trends, collections…"
                                        className={styles.paletteInput}
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && matchingProducts.length > 0) {
                                                window.location.href = `/product/${matchingProducts[0].id}`;
                                                closeSearch();
                                            }
                                        }}
                                    />
                                    <kbd className={styles.kbdClose}>ESC</kbd>
                                </div>

                                <div className={styles.paletteBody}>
                                    {search ? (
                                        <div className={styles.paletteSections}>
                                            {filteredTrends.length > 0 && (
                                                <div className={styles.paletteSection}>
                                                    <div className={styles.paletteSectionHeader}>Categories & Trends</div>
                                                    <div className={styles.trendsGrid}>
                                                        {filteredTrends.map((trend) => (
                                                            <motion.button
                                                                key={trend}
                                                                className={styles.trendTag}
                                                                onClick={() => setSearch(trend)}
                                                                whileTap={reduceMotion ? undefined : { scale: 0.95 }}
                                                                transition={spring.snappy}
                                                            >
                                                                {trend}
                                                            </motion.button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            {matchingProducts.length > 0 ? (
                                                <div className={styles.paletteSection}>
                                                    <div className={styles.paletteSectionHeader}>
                                                        Products
                                                        {matchingProducts.length > 0 && (
                                                            <span className={styles.enterHint}>
                                                                <CornerDownLeft size={11} /> top result
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className={styles.productsList}>
                                                        {matchingProducts.slice(0, 6).map((p, i) => (
                                                            <motion.div
                                                                key={p.id}
                                                                initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                transition={{ ...spring.snappy, delay: 0.03 * i }}
                                                            >
                                                                <Link
                                                                    href={`/product/${p.id}`}
                                                                    className={`${styles.productRow} ${i === 0 ? styles.productRowFirst : ''}`}
                                                                    onClick={closeSearch}
                                                                >
                                                                    <Image src={p.imageUrl} alt={p.name} width={40} height={40} className={styles.productRowImg} />
                                                                    <div className={styles.productRowInfo}>
                                                                        <span className={styles.productRowName}>{p.name}</span>
                                                                        <span className={styles.productRowMeta}>{p.category} • {p.fabric}</span>
                                                                    </div>
                                                                    <div className={styles.productRowPrice}>₹{p.price}</div>
                                                                </Link>
                                                            </motion.div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ) : (
                                                filteredTrends.length === 0 && (
                                                    <div className={styles.paletteEmpty}>
                                                        No results for &quot;{search}&quot;
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    ) : (
                                        <div className={styles.paletteSections}>
                                            <div className={styles.paletteSection}>
                                                <div className={styles.paletteSectionHeader}>Quick navigation</div>
                                                <div className={styles.quickLinksGrid}>
                                                    {[
                                                        { href: '/shop', label: 'All Products' },
                                                        { href: '/collections', label: 'New Drops' },
                                                        { href: '/lookbook', label: 'Lookbook' },
                                                        { href: '/rewards', label: 'Loyalty Rewards' },
                                                    ].map((q) => (
                                                        <Link key={q.href} href={q.href} className={styles.quickLink} onClick={closeSearch}>
                                                            {q.label}
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className={styles.paletteSection}>
                                                <div className={styles.paletteSectionHeader}>Popular searches</div>
                                                <div className={styles.trendsGrid}>
                                                    {trends.slice(0, 5).map((trend) => (
                                                        <motion.button
                                                            key={trend}
                                                            className={styles.trendTag}
                                                            onClick={() => setSearch(trend)}
                                                            whileTap={reduceMotion ? undefined : { scale: 0.95 }}
                                                            transition={spring.snappy}
                                                        >
                                                            {trend}
                                                        </motion.button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    </>
                )}
            </AnimatePresence>
        </motion.header>
    );
};

export default Navbar;
