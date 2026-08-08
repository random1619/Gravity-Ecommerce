'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import styles from './page.module.css';
import type { Collection } from '@/lib/data';
import SplitTextReveal from '@/components/motion/SplitTextReveal';
import ScrollReveal from '@/components/motion/ScrollReveal';
import StaggerGrid from '@/components/motion/StaggerGrid';
import Magnetic from '@/components/motion/Magnetic';

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

    if (loading) {
        return (
            <div className={`container ${styles.collectionsPage}`} aria-busy="true" aria-label="Loading collections">
                <div className={styles.header}>
                    <div className={styles.eyebrowRow}>
                        <span className={styles.rule} aria-hidden="true" />
                        <span className={styles.issue}>Nº 01 — The Index</span>
                        <span className={styles.rule} aria-hidden="true" />
                    </div>
                    <div className={`${styles.titleSkeleton} skeleton`} aria-hidden="true" />
                    <div className={`${styles.subtitleSkeleton} skeleton`} aria-hidden="true" />
                </div>
                <div className={styles.grid}>
                    {Array.from({ length: 4 }, (_, i) => (
                        <div
                            key={i}
                            className={`${styles.gridItem} ${i % 4 === 1 || i % 4 === 2 ? styles.gridItemTall : ''}`}
                            aria-hidden="true"
                        >
                            <div className={`${styles.card} skeleton`} />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className={`container ${styles.collectionsPage}`}>
            <header className={styles.header}>
                <ScrollReveal direction="up" duration={700}>
                    <div className={styles.eyebrowRow}>
                        <span className={styles.rule} aria-hidden="true" />
                        <span className={styles.issue}>Nº 01 — The Index</span>
                        <span className={styles.rule} aria-hidden="true" />
                    </div>
                </ScrollReveal>

                <h1 className={styles.title}>
                    <SplitTextReveal text="NEW DROPS" />
                </h1>

                <ScrollReveal direction="up" delay={220} duration={700}>
                    <div className={styles.subRow}>
                        <p className={styles.subtitle}>
                            Four capsules, chosen slowly. Each one built around a fabric, a fit, or a feeling — not a trend.
                        </p>
                        <div className={styles.countMeta} aria-label={`${collections.length} capsules`}>
                            <span className={styles.countNumber}>{String(collections.length).padStart(2, '0')}</span>
                            <span className={styles.countLabel}>Capsules</span>
                        </div>
                    </div>
                </ScrollReveal>
            </header>

            <StaggerGrid
                className={styles.grid}
                itemClassName={(i) =>
                    `${styles.gridItem} ${i % 4 === 1 || i % 4 === 2 ? styles.gridItemTall : ''}`
                }
            >
                {collections.map((col, i) => (
                    <Link
                        key={col.id}
                        href={`/shop?category=${col.category ?? col.id}`}
                        className={styles.card}
                        aria-label={`${col.title} — ${col.itemCount} pieces`}
                    >
                        <div className={styles.imageWrap}>
                            <Image
                                src={col.imageUrl}
                                alt={col.title}
                                fill
                                sizes="(max-width: 900px) 100vw, 50vw"
                                className={styles.image}
                                priority={i < 2}
                            />
                        </div>
                        <div className={styles.imageOverlay} aria-hidden="true" />

                        <div className={styles.cardTop}>
                            <span className={styles.index} aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                            <span className={styles.chip}>{col.itemCount} pieces</span>
                        </div>

                        <div className={styles.content}>
                            <span className={styles.cardKicker}>{col.subtitle}</span>
                            <span className={styles.cardTitleRow}>
                                <span className={styles.cardTitle}>{col.title}</span>
                                <span className={styles.cardArrow} aria-hidden="true">
                                    <ArrowUpRight size={22} strokeWidth={1.75} />
                                </span>
                            </span>
                            <span className={styles.cardMeta} aria-hidden="true">
                                Explore the capsule
                                <ArrowRight size={14} strokeWidth={2} />
                            </span>
                        </div>
                    </Link>
                ))}
            </StaggerGrid>

            <ScrollReveal direction="up" delay={80}>
                <section className={styles.featuredSection} aria-labelledby="limited-drop-heading">
                    <div className={styles.featuredBanner}>
                        <div className={styles.bannerContent}>
                            <span className={styles.bannerEyebrow}>Limited run · Winter &apos;26</span>
                            <h2 id="limited-drop-heading" className={styles.bannerTitle}>
                                <SplitTextReveal text="THE LAST SHELF" />
                            </h2>
                            <p className={styles.bannerCopy}>
                                Heavyweight fleece, garment-dyed and finished by hand. When the run sells through,
                                the pattern is retired — no restock, no reissue.
                            </p>
                            <Magnetic strength={0.25}>
                                <Link href="/shop" className={styles.bannerBtn}>
                                    Shop the drop
                                    <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
                                </Link>
                            </Magnetic>
                        </div>
                        <div className={styles.bannerAside} aria-hidden="true">
                            <span className={styles.bannerBig}>W&rsquo;26</span>
                            <span className={styles.bannerSmall}>Once it&rsquo;s gone, it&rsquo;s gone.</span>
                        </div>
                    </div>
                </section>
            </ScrollReveal>
        </div>
    );
}
