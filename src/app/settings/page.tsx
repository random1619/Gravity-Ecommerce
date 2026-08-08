'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, Check, LogIn, LogOut, Moon, Settings2, Sun, User } from 'lucide-react';
import styles from './page.module.css';

/** Kowalski spring presets — snappy press, gentle entrances, thumb snap. */
const spring = {
    press: { type: 'spring', stiffness: 500, damping: 30, mass: 0.5 },
    gentle: { type: 'spring', stiffness: 380, damping: 26, mass: 0.7 },
    seal: { type: 'spring', stiffness: 380, damping: 17, mass: 0.7 },
    thumb: { type: 'spring', stiffness: 550, damping: 28, mass: 0.4 },
} as const;
import { useAuth } from '@/lib/AuthContext';
import { useTheme } from '@/lib/ThemeContext';
import Link from 'next/link';
import SplitTextReveal from '@/components/motion/SplitTextReveal';
import ScrollReveal from '@/components/motion/ScrollReveal';
import StaggerGrid from '@/components/motion/StaggerGrid';

interface ToggleProps {
    checked: boolean;
    onToggle: () => void;
    label: string;
}

/** Switch with a real spring thumb and switch semantics. */
function Toggle({ checked, onToggle, label }: ToggleProps) {
    return (
        <motion.button
            type="button"
            role="switch"
            aria-checked={checked}
            aria-label={label}
            className={`${styles.toggle} ${checked ? styles.active : ''}`}
            onClick={onToggle}
            whileTap={{ scale: 0.92 }}
            transition={spring.press}
        >
            <motion.span
                className={styles.toggleThumb}
                initial={false}
                animate={{ x: checked ? 22 : 0 }}
                transition={spring.thumb}
            />
        </motion.button>
    );
}

export default function SettingsPage() {
    const { user, isAuthenticated, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [notifications, setNotifications] = useState(true);
    const [newsletter, setNewsletter] = useState(true);
    const [saved, setSaved] = useState(false);

    const triggerSaved = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const handleToggleTheme = () => {
        toggleTheme();
        triggerSaved();
    };

    const handleToggleNotifications = () => {
        setNotifications((prev) => !prev);
        triggerSaved();
    };

    const handleToggleNewsletter = () => {
        setNewsletter((prev) => !prev);
        triggerSaved();
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
                        <Settings2 size={28} strokeWidth={1.8} />
                    </motion.span>
                    <h1 className={styles.emptyTitle}>
                        <SplitTextReveal text="Settings" delay={0.15} />
                    </h1>
                    <p className={styles.emptyText}>
                        Sign in to manage your profile, appearance, and notification preferences.
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
            <h1 className={styles.title}><SplitTextReveal text="Settings" /></h1>
            <ScrollReveal direction="up" delay={150}>
                <p className={styles.subtitle}>Manage your account preferences</p>
            </ScrollReveal>

            <StaggerGrid className={styles.sections}>
                {/* Profile Section */}
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>
                        <User size={14} aria-hidden="true" />
                        Profile
                    </h2>
                    <div className={styles.card}>
                        <div className={styles.avatar} aria-hidden="true">
                            {user?.name?.charAt(0)?.toUpperCase() ?? 'G'}
                        </div>
                        <div className={styles.profileInfo}>
                            <h3>{user?.name}</h3>
                            <p>{user?.email}</p>
                        </div>
                    </div>
                </div>

                {/* Appearance Section */}
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>
                        {theme === 'dark' ? <Moon size={14} aria-hidden="true" /> : <Sun size={14} aria-hidden="true" />}
                        Appearance
                    </h2>
                    <div className={styles.card}>
                        <div className={styles.setting}>
                            <div>
                                <h4>Dark Mode</h4>
                                <p>Switch between light and dark themes</p>
                            </div>
                            <Toggle checked={theme === 'dark'} onToggle={handleToggleTheme} label="Dark Mode" />
                        </div>
                    </div>
                </div>

                {/* Notifications Section */}
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>
                        <Bell size={14} aria-hidden="true" />
                        Notifications
                    </h2>
                    <div className={styles.card}>
                        <div className={styles.setting}>
                            <div>
                                <h4>Push Notifications</h4>
                                <p>Get notified about orders and offers</p>
                            </div>
                            <Toggle checked={notifications} onToggle={handleToggleNotifications} label="Push Notifications" />
                        </div>
                        <div className={styles.divider}></div>
                        <div className={styles.setting}>
                            <div>
                                <h4>Newsletter</h4>
                                <p>Receive weekly style updates</p>
                            </div>
                            <Toggle checked={newsletter} onToggle={handleToggleNewsletter} label="Newsletter" />
                        </div>
                    </div>
                </div>

                {/* Account Section */}
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>
                        <LogOut size={14} aria-hidden="true" />
                        Account
                    </h2>
                    <div className={styles.card}>
                        <motion.button
                            className={styles.dangerBtn}
                            onClick={logout}
                            whileTap={{ scale: 0.97 }}
                            transition={spring.press}
                        >
                            <LogOut size={16} aria-hidden="true" />
                            Logout
                        </motion.button>
                    </div>
                </div>
            </StaggerGrid>

            <AnimatePresence>
                {saved && (
                    <motion.div
                        className={styles.toast}
                        role="status"
                        initial={{ opacity: 0, y: 16, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.98 }}
                        transition={spring.gentle}
                    >
                        <Check size={16} aria-hidden="true" />
                        Settings saved.
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
