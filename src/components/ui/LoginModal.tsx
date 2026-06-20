'use client';

import React, { useState } from 'react';
import styles from './LoginModal.module.css';
import Modal from './Modal';
import Button from './Button';
import { useAuth } from '@/lib/AuthContext';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
    const { login, register } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

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
                // Reset form
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
        setName('');
        setEmail('');
        setPassword('');
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className={styles.loginModal}>
                <h2 className={styles.title}>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
                <p className={styles.subtitle}>
                    {isLogin ? 'Login to access your account' : 'Join GRAVITY for exclusive deals'}
                </p>

                <form onSubmit={handleSubmit} className={styles.form}>
                    {!isLogin && (
                        <div className={styles.inputGroup}>
                            <label htmlFor="name">Full Name</label>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter your name"
                                required={!isLogin}
                            />
                        </div>
                    )}

                    <div className={styles.inputGroup}>
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@email.com"
                            required
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Min. 6 characters"
                            required
                            minLength={6}
                        />
                    </div>

                    {error && <p className={styles.error}>{error}</p>}

                    <Button variant="primary" size="full" type="submit" disabled={loading}>
                        {loading ? 'Please wait...' : isLogin ? 'Login' : 'Create Account'}
                    </Button>
                </form>

                <div className={styles.toggle}>
                    <p>
                        {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                        <button type="button" onClick={toggleMode} className={styles.toggleBtn}>
                            {isLogin ? 'Sign up' : 'Login'}
                        </button>
                    </p>
                </div>

                <div className={styles.demo}>
                    <p className={styles.demoText}>
                        <strong>Demo:</strong> Use any email and password (min. 6 chars)
                    </p>
                </div>
            </div>
        </Modal>
    );
};

export default LoginModal;
