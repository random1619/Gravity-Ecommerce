'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import type { Collection } from '@/lib/data';

export default function CollectionsPage() {
    const [collections, setCollections] = useState<Collection[]>([]);
    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
        const fetchCollections = async () => {
            try {
                const res = await fetch('/api/collections');
                const data = (await res.json()) as Collection[];
                setCollections(data);
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
                <h1 className={styles.title}>OUR COLLECTIONS</h1>
                <p className={styles.subtitle}>Handpicked styles for every vibe.</p>
            </header>

            <div className={styles.grid}>
                {collections.map((col) => (
                    <Link
                        key={col.id}
                        href={`/shop?category=${col.category ?? col.id}`}
                        className={styles.card}
                    >
                        <div className={styles.imageOverlay}></div>
                        <img src={col.imageUrl} alt={col.title} className={styles.image} />
                        <div className={styles.content}>
                            <div className={styles.badge}>{col.itemCount} ITEMS</div>
                            <h2 className={styles.cardTitle}>{col.title}</h2>
                            <p className={styles.cardSubtitle}>{col.subtitle}</p>
                            <span className={styles.explore}>Explore Collection →</span>
                        </div>
                    </Link>
                ))}
            </div>

            <section className={styles.featuredSection}>
                <div className={styles.featuredBanner}>
                    <h2>WINTER &apos;24 LIMITED DROP</h2>
                    <p>Exclusive heavyweight hoodies and sweatshirts. Once it&apos;s gone, it&apos;s gone.</p>
                    <Link href="/shop" className={styles.bannerBtn}>Shop Limited Drop</Link>
                </div>
            </section>
        </div>
    );
}
