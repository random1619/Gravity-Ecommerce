'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import HeroSlider from '@/components/ui/HeroSlider';
import ProductCard from '@/components/ui/ProductCard';
import ProductSkeleton from '@/components/ui/ProductSkeleton';
import Button from '@/components/ui/Button';
import QuickView from '@/components/ui/QuickView';
import LoginModal from '@/components/ui/LoginModal';
import Marquee from '@/components/ui/Marquee';
import type { Product } from '@/lib/data';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [budgetDrops, setBudgetDrops] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

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
            <div>
              <h2 className={styles.sectionTitle}>NEWEST DROPS</h2>
              <p className={styles.sectionSubtitle}>The freshest styles for the semester.</p>
            </div>
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
          <div className={styles.bannerContent}>
            <h2>VERIFIED STUDENT?</h2>
            <p>Get an extra 20% OFF on all orders. Link your ID in 30 seconds.</p>
            <Link href="/discount">
              <Button variant="secondary" size="lg">Verify Now</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.budgetBg}`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}>UNDER RS. 999</h2>
              <p className={styles.sectionSubtitle}>Drip on a budget. No compromises.</p>
            </div>
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
          <h2 className={styles.sectionTitle}>WATCH THE VIBE</h2>
          <div className={styles.reelsGrid}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} className={styles.reelPlaceholder}>
                <img src={`/reel-${i}.png`} alt={`Gravity Reel ${i}`} className={styles.reelImage} />
                <div className={styles.reelOverlay}>Play</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
