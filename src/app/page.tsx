'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.scss';
import HeroSlider from '@/components/ui/HeroSlider';
import ProductCard from '@/components/ui/ProductCard';
import ProductSkeleton from '@/components/ui/ProductSkeleton';
import Button from '@/components/ui/Button';
import QuickView from '@/components/ui/QuickView';
import LoginModal from '@/components/ui/LoginModal';
import Marquee from '@/components/ui/Marquee';
import ReelModal from '@/components/ui/ReelModal';
import ScrollReveal from '@/components/motion/ScrollReveal';
import SplitTextReveal from '@/components/motion/SplitTextReveal';
import type { Product } from '@/lib/data';

const reelsData = [
    { id: 1, image: '/reel-1.png', caption: 'Rocking the Oversized Graffiti Tee in size L. Combed cotton feels next level! ⚡ #streetwear #oversized #gravity' },
    { id: 2, image: '/reel-2.png', caption: 'Acid Wash Cargos in action. Utility straps, multiple pockets, tapered fit. Rs. 999 only! 📦 #cargopants #drip #campusstyle' },
    { id: 3, image: '/reel-3.png', caption: 'Winter collection preview. Desert Storm Hoodie in heavyweight 350 GSM fleece. Cozy vibe check! ❄️ #winterdrop #hoodie' },
    { id: 4, image: '/reel-4.png', caption: 'Streetwear essentials: Beanie, chain necklace, and Canvas Totebag. Complete the look. 💼 #accessories #streetaccessories' }
];

export default function Home() {
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
    const [budgetDrops, setBudgetDrops] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
    const [showLoginModal, setShowLoginModal] = useState(false);
    
    // Reel state
    const [activeReel, setActiveReel] = useState<{ id: number; image: string; caption: string } | null>(null);

    useEffect(() => {
        const fetchHomeData = async () => {
            setLoading(true);
            try {
                // Fetch specific segments for homepage
                const [res1, res2] = await Promise.all([
                    fetch('/api/products?maxPrice=2000'), // Featured
                    fetch('/api/products?maxPrice=999'), // Budget
                ]);

                const data1 = (await res1.json()) as Product[];
                const data2 = (await res2.json()) as Product[];

                setFeaturedProducts(data1.slice(0, 4));
                setBudgetDrops(data2.slice(0, 4));
            } catch (error) {
                console.error('Home data fetch error:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchHomeData();
    }, []);

    return (
        <div className={styles.home}>
            <QuickView
                isOpen={!!quickViewProduct}
                onClose={() => setQuickViewProduct(null)}
                onLoginRequired={() => setShowLoginModal(true)}
                product={quickViewProduct}
            />
            <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
            
            {/* Reel Modal */}
            <ReelModal
                isOpen={!!activeReel}
                onClose={() => setActiveReel(null)}
                reelId={activeReel?.id ?? null}
                imageUrl={activeReel?.image ?? ''}
                caption={activeReel?.caption ?? ''}
            />

            <HeroSlider />

            <Marquee 
                texts={[
                    "NEW COLD WEATHER DROPS",
                    "FREE SHIPPING OVER ₹1500",
                    "CAMPUS EDITS 2026",
                    "GET 10% OFF FOR STUDENTS",
                    "LIMITED EDITION SWEATSHIRTS"
                ]} 
            />

            <section className={styles.section}>
                <div className="container">
                    <div className={styles.sectionHeader}>
                        <ScrollReveal direction="up" delay={100} duration={800}>
                            <div>
                                <h2 className={styles.sectionTitle}>
                                    <SplitTextReveal text="NEWEST DROPS" />
                                </h2>
                                <p className={styles.sectionSubtitle}>The freshest styles for the semester.</p>
                            </div>
                        </ScrollReveal>
                        <Link href="/shop" className={styles.viewAll}>View All -&gt;</Link>
                    </div>
                    <div className={styles.productGrid}>
                        {loading ? (
                            <>
                                <ProductSkeleton />
                                <ProductSkeleton />
                                <ProductSkeleton />
                                <ProductSkeleton />
                            </>
                        ) : (
                            featuredProducts.map(p => (
                                <ProductCard
                                    key={p.id}
                                    {...p}
                                    onQuickView={() => setQuickViewProduct(p)}
                                />
                            ))
                        )}
                    </div>
                </div>
            </section>

            <section className={styles.discountBanner}>
                <div className="container">
                    <ScrollReveal direction="up" duration={1000}>
                        <div className={styles.bannerContent}>
                            <h2>VERIFIED STUDENT?</h2>
                            <p>Get an extra 20% OFF on all orders. Link your ID in 30 seconds.</p>
                            <Link href="/discount">
                                <Button variant="secondary" size="lg">Verify Now</Button>
                            </Link>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            <section className={`${styles.section} ${styles.budgetBg}`}>
                <div className="container">
                    <div className={styles.sectionHeader}>
                        <ScrollReveal direction="up" delay={100} duration={800}>
                            <div>
                                <h2 className={styles.sectionTitle}>
                                    <SplitTextReveal text="UNDER RS. 999" />
                                </h2>
                                <p className={styles.sectionSubtitle}>Drip on a budget. No compromises.</p>
                            </div>
                        </ScrollReveal>
                        <Link href="/shop?maxPrice=999">
                            <Button variant="outline" size="sm">Explore Deals</Button>
                        </Link>
                    </div>
                    <div className={styles.productGrid}>
                        {loading ? (
                            <>
                                <ProductSkeleton />
                                <ProductSkeleton />
                                <ProductSkeleton />
                                <ProductSkeleton />
                            </>
                        ) : (
                            budgetDrops.map(p => (
                                <ProductCard
                                    key={p.id}
                                    {...p}
                                    onQuickView={() => setQuickViewProduct(p)}
                                />
                            ))
                        )}
                    </div>
                </div>
            </section>

            {/* Mini Reels Section Preview */}
            <section className={styles.section}>
                <div className="container">
                    <ScrollReveal direction="up" duration={800}>
                        <h2 className={styles.sectionTitle}>
                            <SplitTextReveal text="WATCH THE VIBE" />
                        </h2>
                    </ScrollReveal>
                    <div className={styles.reelsGrid}>
                        {reelsData.map(reel => (
                            <div 
                                key={reel.id} 
                                className={styles.reelPlaceholder}
                                onClick={() => setActiveReel(reel)}
                                data-cursor-text="PLAY"
                            >
                                <img src={reel.image} alt={`Gravity Reel ${reel.id}`} className={styles.reelImage} />
                                <div className={styles.reelOverlay}>Play</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
