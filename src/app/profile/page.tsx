'use client';

import React from 'react';
import Link from 'next/link';
import { motion, type Variants } from 'framer-motion';
import styles from './page.module.css';

/**
 * Profile — the account hub. One committed world, shared with the bag page:
 * editorial ledger, one sage accent, hairline borders, tabular figures.
 * Mode: Operate — the visitor completes a task (jump to orders / wishlist /
 * rewards / settings, or sign out). Scanability outranks expression.
 *
 * Kowalski springs — every entrance moves through physics (interruptible),
 * never fixed durations. Damping 1.0 → critically damped, the Apple default.
 */
const spring = {
    press: { type: 'spring', stiffness: 500, damping: 30, mass: 0.5 },
    gentle: { type: 'spring', stiffness: 380, damping: 26, mass: 0.7 },
} as const;

const listVariants: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

const rowVariants: Variants = {
    hidden: { opacity: 0, y: 18, scale: 0.98 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 380, damping: 26, mass: 0.7 } },
};

import SplitTextReveal from '@/components/motion/SplitTextReveal';
import { useAuth } from '@/lib/AuthContext';
import { useCart } from '@/lib/CartContext';
import { useWishlist } from '@/lib/WishlistContext';
import {
    Package, Heart, Star, Settings, ChevronRight,
    LogOut, User, ArrowRight,
} from 'lucide-react';

const MotionLink = motion.create(Link);

const LINKS = [
    { href: '/orders', icon: Package, title: 'My Orders', desc: 'Track, return, or buy things again' },
    { href: '/wishlist', icon: Heart, title: 'Wishlist', desc: 'Everything you saved for later' },
    { href: '/rewards', icon: Star, title: 'Rewards', desc: 'Your drops, perks and student status' },
    { href: '/settings', icon: Settings, title: 'Settings', desc: 'Address, payments and preferences' },
] as const;

export default function ProfilePage() {
    const { user, isAuthenticated, logout } = useAuth();
    const { cartCount } = useCart();
    const { wishlist } = useWishlist();

    /* Logged-out state — mirrors the bag's empty state: one ring icon,
       one title, one action. The page is for members. */
    if (!isAuthenticated || !user) {
        return (
            <div className={styles.container}>
                <div className={styles.emptyWrap}>
                    <div className={styles.emptyIconRing}>
                        <User size={26} strokeWidth={1.5} />
                    </div>
                    <h1 className={styles.emptyTitle}>
                        <SplitTextReveal text="YOUR PROFILE" />
                    </h1>
                    <p className={styles.emptySub}>Sign in to see your orders, wishlist and rewards.</p>
                    <MotionLink
                        href="/"
                        className={styles.emptyCta}
                        whileTap={{ scale: 0.97 }}
                        transition={spring.press}
                    >
                        Continue shopping <ArrowRight size={16} />
                    </MotionLink>
                </div>
            </div>
        );
    }

    const initial = user.name.trim().charAt(0).toUpperCase();
    const stats = [
        { label: 'Orders', value: '—', note: 'track deliveries' },
        { label: 'Wishlist', value: String(wishlist.length), note: wishlist.length === 1 ? 'item saved' : 'items saved' },
        { label: 'In your bag', value: String(cartCount), note: 'ready to checkout' },
    ];

    return (
        <div className={styles.container}>
            {/* Masthead — identity, not a form. One accent, one hero move. */}
            <header className={styles.masthead}>
                <motion.div
                    className={styles.avatarRing}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={spring.gentle}
                >
                    <span className={styles.avatarInitial}>{initial}</span>
                </motion.div>
                <div className={styles.identity}>
                    <p className={styles.eyebrow}>Account</p>
                    <h1 className={styles.title}>
                        <SplitTextReveal text={user.name.toUpperCase()} />
                    </h1>
                    <p className={styles.email}>{user.email}</p>
                </div>
            </header>

            {/* Ledger strip — numbers in tabular-nums, the cart page's figures. */}
            <motion.section
                className={styles.ledger}
                variants={listVariants}
                initial="hidden"
                animate="show"
                aria-label="Account at a glance"
            >
                {stats.map((stat) => (
                    <motion.div key={stat.label} className={styles.ledgerCell} variants={rowVariants}>
                        <span className={styles.ledgerValue}>{stat.value}</span>
                        <span className={styles.ledgerLabel}>{stat.label}</span>
                        <span className={styles.ledgerNote}>{stat.note}</span>
                    </motion.div>
                ))}
            </motion.section>

            {/* Account rows — Operate mode: scan, tap, done. */}
            <motion.nav
                className={styles.rows}
                variants={listVariants}
                initial="hidden"
                animate="show"
                aria-label="Account sections"
            >
                {LINKS.map(({ href, icon: Icon, title, desc }) => (
                    <motion.div key={href} variants={rowVariants}>
                        <MotionLink href={href} className={styles.row} whileTap={{ scale: 0.985 }} transition={spring.press}>
                            <span className={styles.rowIcon}>
                                <Icon size={18} strokeWidth={1.75} />
                            </span>
                            <span className={styles.rowText}>
                                <span className={styles.rowTitle}>{title}</span>
                                <span className={styles.rowDesc}>{desc}</span>
                            </span>
                            <ChevronRight size={16} className={styles.rowChevron} />
                        </MotionLink>
                    </motion.div>
                ))}
            </motion.nav>

            {/* Sign out — the destructive row, using the system's error tokens. */}
            <motion.button
                type="button"
                className={styles.logoutRow}
                onClick={logout}
                whileTap={{ scale: 0.985 }}
                transition={spring.press}
            >
                <LogOut size={16} />
                Sign out
            </motion.button>
        </div>
    );
}
