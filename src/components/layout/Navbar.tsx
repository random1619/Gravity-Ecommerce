'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from './Navbar.module.css';
import Button from '../ui/Button';
import { useTheme } from '@/lib/ThemeContext';
import { useCart } from '@/lib/CartContext';
import { useAuth } from '@/lib/AuthContext';
import LoginModal from '../ui/LoginModal';
import CartDrawer from '../ui/CartDrawer';
import { Sun, Moon, ShoppingCart, User, ChevronDown, Package, Heart, Settings, LogOut, Search } from 'lucide-react';
import type { Product } from '@/lib/data';

const Navbar = () => {
    const { theme, toggleTheme } = useTheme();
    const { cartCount, openCart } = useCart();
    const { user, logout, isAuthenticated } = useAuth();
    const [search, setSearch] = useState('');
    const [trends, setTrends] = useState<string[]>([]);
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchTrends = async () => {
            try {
                const res = await fetch('/api/products');
                const products = await res.json();
                setAllProducts(products);
                const uniqueCategories = Array.from(new Set(products.map((p: Product) => p.category))) as string[];
                setTrends([...uniqueCategories, 'Oversized', 'Streetwear', 'New Drops']);
            } catch (err) {
                console.error('Failed to fetch trends', err);
            }
        };
        fetchTrends();
    }, []);

    const filteredTrends = trends.filter(trend =>
        trend.toLowerCase().includes(search.toLowerCase())
    );

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                setIsSearchOpen(prev => !prev);
            }
            if (e.key === 'Escape') {
                setIsSearchOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // Close user dropdown when clicking outside
            const userMenu = document.querySelector(`.${styles.userMenu}`);
            if (userMenu && !userMenu.contains(event.target as Node)) {
                setShowUserDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const matchingProducts = allProducts.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <nav className={styles.navbar}>
            <div className={`container ${styles.navContainer}`}>
                <Link href="/" className={styles.logo}>
                    GRAVITY.
                </Link>

                <div className={styles.links}>
                    <Link href="/shop" className={styles.link}>Shop</Link>
                    <Link href="/collections" className={styles.link}>New Drops</Link>
                    <Link href="/lookbook" className={styles.link}>Lookbook</Link>
                    <Link href="/rewards" className={styles.link}>Rewards</Link>
                    <Link href="/discount" className={styles.link}>Student Offer</Link>
                </div>

                <div className={styles.actions}>
                    <div className={styles.searchBarTrigger} onClick={() => setIsSearchOpen(true)}>
                        <Search size={16} className={styles.searchIconInline} />
                        <span className={styles.searchPlaceholderText}>Search trends...</span>
                        <div className={styles.kbdContainer}>
                            <kbd className={styles.kbd}>Ctrl</kbd>
                            <kbd className={styles.kbd}>K</kbd>
                        </div>
                    </div>

                    <button className={styles.themeToggle} onClick={toggleTheme} aria-label="Toggle Theme">
                        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                    </button>

                    <button className={styles.iconBtn} aria-label="Cart" onClick={openCart}>
                        <div className={styles.cartIcon}>
                            <ShoppingCart size={20} />
                            <span className={styles.badge}>{cartCount}</span>
                        </div>
                    </button>

                    {isAuthenticated ? (
                        <div className={styles.userMenu}>
                            <button
                                className={styles.userBtn}
                                onClick={() => setShowUserDropdown(!showUserDropdown)}
                            >
                                <User size={16} className={styles.avatar} />
                                <span>Hi, {user?.name}</span>
                                <ChevronDown size={14} className={styles.dropdownArrow} />
                            </button>
                            {showUserDropdown && (
                                <div className={styles.userDropdown}>
                                    <div className={styles.dropdownHeader}>
                                        <div className={styles.dropdownAvatar}>
                                            <User size={20} />
                                        </div>
                                        <div>
                                            <p className={styles.dropdownName}>{user?.name}</p>
                                            <p className={styles.dropdownEmail}>{user?.email}</p>
                                        </div>
                                    </div>
                                    <div className={styles.dropdownDivider}></div>
                                    <Link href="/orders" className={styles.dropdownItem} onClick={() => setShowUserDropdown(false)}>
                                        <Package size={16} /> My Orders
                                    </Link>
                                    <Link href="/wishlist" className={styles.dropdownItem} onClick={() => setShowUserDropdown(false)}>
                                        <Heart size={16} /> Wishlist
                                    </Link>
                                    <Link href="/settings" className={styles.dropdownItem} onClick={() => setShowUserDropdown(false)}>
                                        <Settings size={16} /> Settings
                                    </Link>
                                    <div className={styles.dropdownDivider}></div>
                                    <button
                                        className={styles.logoutBtn}
                                        onClick={() => { logout(); setShowUserDropdown(false); }}
                                    >
                                        <LogOut size={16} /> Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Button variant="primary" size="sm" onClick={() => setShowLoginModal(true)}>
                            Login
                        </Button>
                    )}
                </div>
            </div>

            <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
            <CartDrawer />

            {isSearchOpen && (
                <div className={styles.searchOverlay} onClick={() => setIsSearchOpen(false)}>
                    <div className={styles.searchModal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <Search size={20} className={styles.modalSearchIcon} />
                            <input
                                type="text"
                                placeholder="Type to search products, trends, or collections..."
                                className={styles.modalInput}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                autoFocus
                            />
                            <div className={styles.modalCloseHint}>
                                <kbd className={styles.kbdClose}>ESC</kbd>
                            </div>
                        </div>
                        
                        <div className={styles.modalContent}>
                            {search ? (
                                <div className={styles.modalSectionsContainer}>
                                    {filteredTrends.length > 0 && (
                                        <div className={styles.modalSection}>
                                            <div className={styles.modalSectionHeader}>Categories & Trends</div>
                                            <div className={styles.trendsGrid}>
                                                {filteredTrends.map(trend => (
                                                    <button
                                                        key={trend}
                                                        className={styles.trendTag}
                                                        onClick={() => {
                                                            setSearch(trend);
                                                        }}
                                                    >
                                                        {trend}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    
                                    {matchingProducts.length > 0 ? (
                                        <div className={styles.modalSection}>
                                            <div className={styles.modalSectionHeader}>Matching Products</div>
                                            <div className={styles.productsList}>
                                                {matchingProducts.map(p => (
                                                    <Link
                                                        href={`/product/${p.id}`}
                                                        key={p.id}
                                                        className={styles.productRow}
                                                        onClick={() => setIsSearchOpen(false)}
                                                    >
                                                        <img src={p.imageUrl} alt={p.name} className={styles.productRowImg} />
                                                        <div className={styles.productRowInfo}>
                                                            <span className={styles.productRowName}>{p.name}</span>
                                                            <span className={styles.productRowMeta}>{p.category} • {p.fabric}</span>
                                                        </div>
                                                        <div className={styles.productRowPrice}>₹{p.price}</div>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        filteredTrends.length === 0 && (
                                            <div className={styles.modalNoResults}>
                                                No results found for "{search}"
                                            </div>
                                        )
                                    )}
                                </div>
                            ) : (
                                <div className={styles.searchPlaceholderState}>
                                    <div className={styles.placeholderSection}>
                                        <div className={styles.modalSectionHeader}>Quick Navigation</div>
                                        <div className={styles.quickLinksGrid}>
                                            <Link href="/shop" className={styles.quickLinkItem} onClick={() => setIsSearchOpen(false)}>
                                                <span>All Products</span>
                                            </Link>
                                            <Link href="/collections" className={styles.quickLinkItem} onClick={() => setIsSearchOpen(false)}>
                                                <span>New Drops</span>
                                            </Link>
                                            <Link href="/lookbook" className={styles.quickLinkItem} onClick={() => setIsSearchOpen(false)}>
                                                <span>Lookbook</span>
                                            </Link>
                                            <Link href="/rewards" className={styles.quickLinkItem} onClick={() => setIsSearchOpen(false)}>
                                                <span>Loyalty Rewards</span>
                                            </Link>
                                        </div>
                                    </div>
                                    
                                    <div className={styles.placeholderSection}>
                                        <div className={styles.modalSectionHeader}>Popular Searches</div>
                                        <div className={styles.trendsGrid}>
                                            {trends.slice(0, 5).map(trend => (
                                                <button
                                                    key={trend}
                                                    className={styles.trendTag}
                                                    onClick={() => setSearch(trend)}
                                                >
                                                    {trend}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
