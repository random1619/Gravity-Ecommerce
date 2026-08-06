'use client';

import React from 'react';
import Image from 'next/image';
import { Heart, MessageCircle, ArrowUpRight } from 'lucide-react';
import styles from './InstagramGrid.module.css';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import ScrollReveal from '@/components/motion/ScrollReveal';

interface Tile {
  id: number;
  image: string;
  caption: string;
  likes: string;
  comments: string;
  span: 's1' | 's2' | 's3' | 's4' | 's5' | 's6';
  tag?: string;
}

const tiles: Tile[] = [
  { id: 1, image: '/look1.png', caption: 'Minimalist Drip. The whole fit under ₹1700.', likes: '3.1k', comments: '240', span: 's1', tag: 'Featured' },
  { id: 2, image: '/reel-5.png', caption: 'Grey Hoodie & Beanie. Morning campus vibe check.', likes: '4.8k', comments: '310', span: 's4', tag: 'Trending' },
  { id: 3, image: '/reel-3.png', caption: 'Desert Storm Hoodie. Winter is handled.', likes: '1.9k', comments: '134', span: 's3' },
  { id: 4, image: '/look2.png', caption: 'Desert Breeze fit. Street editorial, campus price.', likes: '2.8k', comments: '201', span: 's2' },
  { id: 5, image: '/reel-6.png', caption: 'Cobalt Blue Outerwear & Silver Chain combo.', likes: '5.2k', comments: '412', span: 's5' },
  { id: 6, image: '/look3.png', caption: 'Distressed Indigo. The jacket you will live in.', likes: '3.6k', comments: '267', span: 's6' },
];

const community = ['/reel-1.png', '/reel-5.png', '/reel-3.png', '/reel-6.png', '/look1.png', '/look4.png'];

export default function InstagramPage() {
  return (
    <div className={styles.page}>
      <div className="container">
        <Breadcrumbs />

        <header className={styles.header}>
          <ScrollReveal direction="up" duration={700}>
            <span className={styles.eyebrow}>@gravity.style</span>
            <h1 className={styles.title}>
              The grid, <em>curated.</em>
            </h1>
            <p className={styles.subtitle}>
              Not a feed, a moodboard. Fits, drops, and the #GRAVITYStyle community,
              arranged the way we&apos;d pin them to a wall.
            </p>
            <div className={styles.followRow}>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--cta btn--lg"
              >
                Follow on Instagram
                <ArrowUpRight size={18} />
              </a>
            </div>
          </ScrollReveal>
        </header>

        <div className={styles.collage}>
          {tiles.map((tile, i) => (
            <article
              key={tile.id}
              className={`${styles.tile} ${styles[tile.span]} stagger`}
              style={{ ['--i' as string]: i }}
              tabIndex={0}
            >
              {tile.tag && <span className={styles.tagChip}>{tile.tag}</span>}
              <Image
                src={tile.image}
                alt={tile.caption}
                fill
                sizes="(max-width: 1024px) 50vw, 40vw"
              />
              <div className={styles.tileOverlay}>
                <p className={styles.tileCaption}>{tile.caption}</p>
                <div className={styles.tileMeta}>
                  <span><Heart size={14} /> {tile.likes}</span>
                  <span><MessageCircle size={14} /> {tile.comments}</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        <ScrollReveal direction="up" duration={900}>
          <section className={styles.community}>
            <h2 className={styles.communityTitle}>Tagged by you</h2>
            <p className={styles.communitySub}>
              Real fits from the #GRAVITYStyle community. Tag us to get featured.
            </p>
            <div className={styles.avatars}>
              {community.map((src, i) => (
                <div key={i} className={styles.avatar}>
                  <Image src={src} alt={`Community fit ${i + 1}`} fill sizes="56px" style={{ objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          </section>
        </ScrollReveal>
      </div>
    </div>
  );
}
