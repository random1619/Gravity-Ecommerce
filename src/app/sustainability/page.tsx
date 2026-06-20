'use client'

import React from 'react'
import styles from './page.module.css'
import Breadcrumbs from '@/components/ui/Breadcrumbs'

export default function SustainabilityPage() {
  return (
    <div className={styles.sustainabilityPage}>
      <div className="container">
        <Breadcrumbs />
        
        <header className={styles.header}>
          <span className={styles.tag}>CONSCIOUS DROPS</span>
          <h1 className={styles.title}>FASHION THAT LASTS. RESPONSIBLY MADE.</h1>
          <p className={styles.subtitle}>
            We believe you shouldn&apos;t have to choose between looking good and doing good. Here&apos;s how GRAVITY is redefining streetwear with planet-first practices.
          </p>
        </header>

        {/* Story Section */}
        <section className={styles.storySection}>
          <div className={styles.storyImageWrapper}>
            <img src="/sustainability-hero.png" alt="Eco fabric close-up" className={styles.storyImage} />
          </div>
          <div className={styles.storyContent}>
            <h2>Our Sustainability Goal</h2>
            <p>
              By 2028, our goal is to manufacture 100% of our products using organically grown, recycled, or circular fabrics. We&apos;re committed to shifting away from virgin polyester and conventional water-heavy cotton.
            </p>
            <div className={styles.statGrid}>
              <div className={styles.statCard}>
                <h3>240 GSM</h3>
                <p>Organic Combed Cotton</p>
              </div>
              <div className={styles.statCard}>
                <h3>38%</h3>
                <p>Water Saved vs. Industry Avg</p>
              </div>
              <div className={styles.statCard}>
                <h3>100%</h3>
                <p>Biodegradable Mailers</p>
              </div>
            </div>
          </div>
        </section>

        {/* Pillars Section */}
        <section className={styles.pillarsSection}>
          <h2>The Three Pillars of Conscious Drip</h2>
          <div className={styles.pillarsGrid}>
            <div className={styles.pillarCard}>
              <div className={styles.icon}>🌾</div>
              <h3>Organic & Circular Fabrics</h3>
              <p>
                All of our signature heavyweight tees are crafted from GOTS-certified organic cotton. No harmful pesticides, no toxic chemicals—just pure, breathable fibers that feel amazing and are kind to the soil.
              </p>
            </div>
            <div className={styles.pillarCard}>
              <div className={styles.icon}>🏭</div>
              <h3>Ethical Manufacturing</h3>
              <p>
                We partner only with WRAP-certified factories that guarantee fair living wages, safe working environments, and zero forced labor. We regularly visit our production sites to ensure our standards are met.
              </p>
            </div>
            <div className={styles.pillarCard}>
              <div className={styles.icon}>📦</div>
              <h3>Zero-Waste Packaging</h3>
              <p>
                Your orders ship in fully compostable mailers made from cornstarch and PBAT, which break down naturally in 180 days. Inside, we avoid all single-use plastic tags and wrap items in recycled paper wrap.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
