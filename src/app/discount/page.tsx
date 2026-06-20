'use client';

import React, { useState } from 'react';
import styles from './page.module.css';
import Button from '@/components/ui/Button';

export default function StudentDiscount() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({ name: '', email: '', college: '', studentId: '' });
    const [isVerifying, setIsVerifying] = useState(false);

    const handleNext = async (e: React.FormEvent) => {
        e.preventDefault();
        if (step === 1) setStep(2);
        else if (step === 2) {
            setIsVerifying(true);
            try {
                const response = await fetch('/api/verify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });
                const result = await response.json();
                if (result.success) {
                    setStep(3);
                }
            } catch (error) {
                console.error('Verification failed:', error);
            } finally {
                setIsVerifying(false);
            }
        }
    };

    return (
        <div className={`container ${styles.discountPage}`}>
            <div className={styles.card}>
                <header className={styles.header}>
                    <span className={styles.discountBadge}>SAVE 20% EXTRA</span>
                    <h1>STUDENT VERIFICATION</h1>
                    <p>Join 50,000+ students getting exclusive drops at the best prices.</p>
                </header>

                <div className={styles.stepper}>
                    <div className={`${styles.step} ${step >= 1 ? styles.stepActive : ''}`}>1. Info</div>
                    <div className={`${styles.step} ${step >= 2 ? styles.stepActive : ''}`}>2. ID Upload</div>
                    <div className={`${styles.step} ${step >= 3 ? styles.stepActive : ''}`}>3. Success</div>
                </div>

                <main className={styles.content}>
                    {step === 1 && (
                        <form onSubmit={handleNext} className={styles.form}>
                            <div className={styles.inputGroup}>
                                <label>Full Name (as per Student ID)</label>
                                <input
                                    type="text"
                                    placeholder="Rahul Sharma"
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    placeholder="you@college.edu"
                                    required
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>College / University</label>
                                <input
                                    type="text"
                                    placeholder="IIT Delhi"
                                    required
                                    value={formData.college}
                                    onChange={e => setFormData({ ...formData, college: e.target.value })}
                                />
                            </div>
                            <Button variant="primary" size="full">Continue to Upload</Button>
                        </form>
                    )}

                    {step === 2 && (
                        <div className={styles.uploadSection}>
                            <div className={styles.inputGroup}>
                                <label>Student ID Number</label>
                                <input
                                    type="text"
                                    placeholder="STU123456"
                                    required
                                    value={formData.studentId}
                                    onChange={e => setFormData({ ...formData, studentId: e.target.value })}
                                />
                            </div>
                            <div className={styles.uploadBox}>
                                <span className={styles.uploadIcon}>🪪</span>
                                <p>Drag & drop your Student ID card or click to browse</p>
                                <input type="file" className={styles.fileInput} />
                            </div>
                            <p className={styles.hint}>Make sure your name and expiry date are clearly visible.</p>
                            <Button
                                variant="primary"
                                size="full"
                                onClick={handleNext}
                                isLoading={isVerifying}
                            >
                                Verify My Identity
                            </Button>
                        </div>
                    )}

                    {step === 3 && (
                        <div className={styles.successState}>
                            <div className={styles.successIcon}>✅</div>
                            <h2>YOU&apos;RE VERIFIED!</h2>
                            <p>Your exclusive student discount has been applied to your account. Enjoy 20% OFF on everything.</p>
                            <div className={styles.promoBox}>
                                <span>PROMO CODE:</span>
                                <strong>STUDENT20</strong>
                            </div>
                            <Button variant="primary" size="full" onClick={() => window.location.href = '/shop'}>
                                Start Shopping
                            </Button>
                        </div>
                    )}
                </main>

                <section className={styles.faq}>
                    <h3>Frequently Asked Questions</h3>
                    <div className={styles.faqItem}>
                        <h4>How long does verification take?</h4>
                        <p>Usually instant! However, some manual checks might take up to 24 hours.</p>
                    </div>
                    <div className={styles.faqItem}>
                        <h4>Is my data safe?</h4>
                        <p>Yes, we use secure hashing to verify your identity and don&apos;t store raw ID images.</p>
                    </div>
                </section>
            </div>
        </div>
    );
}
