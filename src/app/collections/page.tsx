'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';
import type { Collection } from '@/lib/data';
import SplitTextReveal from '@/components/motion/SplitTextReveal';
import ScrollReveal from '@/components/motion/ScrollReveal';
import StaggerGrid from '@/components/motion/StaggerGrid';

export default function CollectionsPage() {
    const [collections, setCollections] = useState<Collection[]>([]);
    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
        const fetchCollections = async () => {
            try {
                const res = await fetch('/api/collections');
                const data: unknown = res.ok ? await res.json() : [];
                setCollections(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCollections();
    }, []);

    if (loading) return <div className="container" style={{ padding: '100px', textAlign: 'center' }}>Loading collections...</div>;

    return (
        <div className={`container ${styles.collectionsPage}`}>
            <header className={styles.header}>
                <h1 className={styles.title}><SplitTextReveal text="OUR COLLECTIONS" /></h1>
                <ScrollReveal direction="up" delay={150}>
                    <p className={styles.subtitle}>Handpicked styles for every vibe.</p>
                </ScrollReveal>
            </header>

            <StaggerGrid className={styles.grid}>
                {collections.map((col) => (
                    <Link
                        key={col.id}
                        href={`/shop?category=${col.category ?? col.id}`}
                        className={styles.card}
                    >
                        <div className={styles.imageOverlay}></div>
                        <Image src={col.imageUrl} alt={col.title} fill sizes="(max-width: 768px) 100vw, 50vw" className={styles.image} />
                        <div className={styles.content}>
                            <div className={styles.badge}>{col.itemCount} ITEMS</div>
                            <h2 className={styles.cardTitle}>{col.title}</h2>
                            <p className={styles.cardSubtitle}>{col.subtitle}</p>
                            <span className={styles.explore}>Explore Collection →</span>
                        </div>
                    </Link>
                ))}
            </StaggerGrid>

            <ScrollReveal direction="up" delay={120}>
                <section className={styles.featuredSection}>
                    <div className={styles.featuredBanner}>
                        <h2><SplitTextReveal text="WINTER &apos;24 LIMITED DROP" /></h2>
                        <p>Exclusive heavyweight hoodies and sweatshirts. Once it&apos;s gone, it&apos;s gone.</p>
                        <Link href="/shop" className={styles.bannerBtn}>Shop Limited Drop</Link>
                    </div>
                </section>
            </ScrollReveal>
        </div>
    );
}
