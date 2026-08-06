'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowRight, X, Sparkles } from 'lucide-react';
import styles from './LoginModal.module.css';
import Modal from './Modal';
import { useAuth } from '@/lib/AuthContext';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

/**
 * "Backstage Pass" — the login panel re-imagined as a members'-club ticket.
 * Dark editorial cover on the left (the one gold ember glow lives here),
 * light perforated form-stub on the right. Toggle flips the ticket.
 */
const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
    const { login, register } = useAuth();
    const shouldReduceMotion = useReducedMotion();
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [focused, setFocused] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            let success = false;
            if (isLogin) {
                success = await login(email, password);
            } else {
                success = await register(name, email, password);
            }

            if (success) {
                setName('');
                setEmail('');
                setPassword('');
                onClose();
            } else {
                setError(isLogin ? 'Invalid credentials' : 'Registration failed');
            }
        } catch {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setError('');
    };

    /* Staggered field entrance — the stub fills itself in, top to bottom */
    const fieldVariants = {
        hidden: { opacity: 0, y: 14 },
        show: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: { delay: 0.15 + i * 0.07, duration: 0.4, ease: [0.16, 1, 0.3, 1] as const },
        }),
    };

    const fields = [
        ...(!isLogin
            ? [{
                  id: 'name', label: 'Full Name', type: 'text', value: name,
                  set: setName, placeholder: 'Ada Lovelace', required: true,
              }]
            : []),
        {
            id: 'email', label: 'Email', type: 'email', value: email,
            set: setEmail, placeholder: 'you@gravity.shop', required: true,
        },
        {
            id: 'password', label: 'Password', type: 'password', value: password,
            set: setPassword, placeholder: 'Min. 6 characters', required: true,
        },
    ];

    return (
        <Modal isOpen={isOpen} onClose={onClose} hideCloseButton>
            <div className={styles.pass}>
                {/* ---------- Cover — dark editorial panel, the one gold light ---------- */}
                <motion.div
                    className={styles.cover}
                    initial={shouldReduceMotion ? false : { x: -40, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                >
                    {/* Ember glow — the single warm light source, breathing slowly */}
                    {!shouldReduceMotion && <div className={styles.ember} aria-hidden="true" />}

                    <div className={styles.coverTop}>
                        <span className={styles.coverKicker}>
                            <Sparkles size={12} aria-hidden="true" /> Members Only
                        </span>
                    </div>

                    <h2 className={styles.coverTitle}>
                        Back<em>stage</em>
                        <span className={styles.coverTitleThin}>Access</span>
                    </h2>

                    <p className={styles.coverCopy}>
                        One pass. Early drops, private pricing, and the pieces that never
                        reach the floor.
                    </p>

                    {/* Vertical masthead — the editorial edge */}
                    <span className={styles.masthead} aria-hidden="true">
                        GRAVITY · EST. MMXXVI · ISSUE Nº 07
                    </span>

                    {/* Barcode + serial sell the ticket metaphor */}
                    <div className={styles.ticketMeta}>
                        <div className={styles.barcode} aria-hidden="true">
                                            {Array.from({ length: 28 }).map((_, i) => (
                                <span
                                    key={i}
                                    style={{ width: `${(i * 7) % 3 + 1}px` }}
                                />
                            ))}
                        </div>
                        <span className={styles.serial}>SN-0712-GRV-PASS</span>
                    </div>
                </motion.div>

                {/* ---------- Perforated edge ---------- */}
                <div className={styles.perforation} aria-hidden="true">
                    <span className={styles.notchTop} />
                    <span className={styles.notchBottom} />
                </div>

                {/* ---------- Stub — the form you tear off ---------- */}
                <div className={styles.stub}>
                    <button className={styles.close} onClick={onClose} aria-label="Close">
                        <X size={18} />
                    </button>

                    {/* Mode flip — the sliding tab reads like turning the ticket over */}
                    <div className={styles.modeTabs} role="tablist" aria-label="Authentication mode">
                        {(['Sign In', 'Join'] as const).map((label) => {
                            const active = (label === 'Sign In') === isLogin;
                            return (
                                <button
                                    key={label}
                                    role="tab"
                                    aria-selected={active}
                                    className={`${styles.modeTab} ${active ? styles.modeTabActive : ''}`}
                                    onClick={() => { if (!active) toggleMode(); }}
                                >
                                    {active && (
                                        <motion.span
                                            className={styles.modeTabPill}
                                            layoutId={shouldReduceMotion ? undefined : 'pass-mode-pill'}
                                            transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                                        />
                                    )}
                                    <span className={styles.modeTabLabel}>{label}</span>
                                </button>
                            );
                        })}
                    </div>

                    <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                            key={isLogin ? 'login' : 'register'}
                            initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
                            transition={{ duration: 0.25, ease: 'easeOut' }}
                        >
                            <h3 className={styles.stubTitle}>
                                {isLogin ? 'Welcome back.' : 'Take your seat.'}
                            </h3>
                            <p className={styles.stubSub}>
                                {isLogin
                                    ? 'Your pass is still warm.'
                                    : 'Join GRAVITY for the next drop.'}
                            </p>

                            <form onSubmit={handleSubmit} className={styles.form}>
                                {fields.map((f, i) => (
                                    <motion.div
                                        key={f.id}
                                        className={`${styles.field} ${
                                            focused === f.id || f.value ? styles.fieldRaised : ''
                                        }`}
                                        custom={i}
                                        variants={fieldVariants}
                                        initial="hidden"
                                        animate="show"
                                    >
                                        <input
                                            id={f.id}
                                            type={f.type}
                                            value={f.value}
                                            onChange={(e) => f.set(e.target.value)}
                                            onFocus={() => setFocused(f.id)}
                                            onBlur={() => setFocused(null)}
                                            placeholder={f.placeholder}
                                            required={f.required}
                                            minLength={f.type === 'password' ? 6 : undefined}
                                            autoComplete={
                                                f.id === 'password'
                                                    ? isLogin ? 'current-password' : 'new-password'
                                                    : f.id
                                            }
                                        />
                                        <label htmlFor={f.id}>{f.label}</label>
                                        <span className={styles.fieldLine} aria-hidden="true" />
                                    </motion.div>
                                ))}

                                <AnimatePresence>
                                    {error && (
                                        <motion.p
                                            className={styles.error}
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                        >
                                            {error}
                                        </motion.p>
                                    )}
                                </AnimatePresence>

                                <motion.button
                                    type="submit"
                                    className={styles.submit}
                                    disabled={loading}
                                    whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
                                    custom={fields.length}
                                    variants={fieldVariants}
                                    initial="hidden"
                                    animate="show"
                                >
                                    <span className={styles.submitLabel}>
                                        {loading
                                            ? 'Checking the list...'
                                            : isLogin ? 'Enter' : 'Claim Pass'}
                                    </span>
                                    <ArrowRight size={16} className={styles.submitArrow} aria-hidden="true" />
                                </motion.button>
                            </form>

                            <p className={styles.demoNote}>
                                Demo: any email + password of 6+ characters gets you in.
                            </p>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </Modal>
    );
};

export default LoginModal;
