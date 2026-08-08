'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Camera, Music2, AtSign, ArrowUpRight, Heart, Star } from 'lucide-react';
import styles from './SocialHub.module.css';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import ScrollReveal from '@/components/motion/ScrollReveal';

interface Platform {
  id: string;
  href: string;
  name: string;
  handle: string;
  blurb: string;
  stat: string;
  statLabel: string;
  icon: React.ReactNode;
  preview: string;
  accent: string;
}

const platforms: Platform[] = [
  {
    id: 'instagram',
    href: '/social/instagram',
    name: 'Instagram',
    handle: '@gravity.style',
    blurb: 'The grid, curated. Fits, drops, and the #GRAVITYStyle community arranged like a moodboard.',
    stat: '128k',
    statLabel: 'followers',
    icon: <Camera size={22} />,
    preview: '/look1.png',
    accent: 'var(--accent-primary)',
  },
  {
    id: 'tiktok',
    href: '/social/tiktok',
    name: 'TikTok',
    handle: '@gravity.drip',
    blurb: 'Sound on, scroll sideways. GRWMs, transitions, and the fits in motion.',
    stat: '2.4M',
    statLabel: 'likes',
    icon: <Music2 size={22} />,
    preview: '/reel-2.png',
    accent: 'var(--accent-secondary)',
  },
  {
    id: 'x',
    href: '/social/x',
    name: 'X / Twitter',
    handle: '@gravitystyle',
    blurb: 'Drop alerts, restock warnings, and the occasional hot take. Hear it first.',
    stat: '54k',
    statLabel: 'followers',
    icon: <AtSign size={22} />,
    preview: '/look3.png',
    accent: 'var(--accent-gold)',
  },
];

const community = [
  { image: '/reel-1.png', likes: '4.2k' },
  { image: '/reel-2.png', likes: '3.1k' },
  { image: '/reel-3.png', likes: '5.8k' },
  { image: '/reel-4.png', likes: '2.7k' },
  { image: '/look1.png', likes: '6.4k' },
  { image: '/look2.png', likes: '3.9k' },
];

export default function SocialHubPage() {
  return (
    <div className={styles.page}>
      <div className="container">
        <Breadcrumbs />

        <header className={styles.header}>
          <ScrollReveal direction="up" duration={700}>
            <span className={styles.eyebrow}>@gravity.campus</span>
            <h1 className={styles.title}>
              Everywhere you <em>scroll.</em>
            </h1>
            <p className={styles.subtitle}>
              One community, three feeds. Pick your platform. The fits, the drops,
              and the people wearing them are all here.
            </p>
          </ScrollReveal>
        </header>

        {/* Platform cards */}
        <div className={styles.platformGrid}>
          {platforms.map((p, i) => (
            <ScrollReveal key={p.id} direction="up" delay={i * 100} duration={700}>
              <Link href={p.href} className={styles.platformCard} style={{ ['--accent' as string]: p.accent }}>
                <div className={styles.platformPreview}>
                  <Image src={p.preview} alt={`${p.name} preview`} fill sizes="(max-width: 768px) 100vw, 33vw" className={styles.platformImg} />
                  <span className={styles.platformIcon}>{p.icon}</span>
                </div>
                <div className={styles.platformBody}>
                  <div className={styles.platformTop}>
                    <div>
                      <h2 className={styles.platformName}>{p.name}</h2>
                      <span className={styles.platformHandle}>{p.handle}</span>
                    </div>
                    <ArrowUpRight size={20} className={styles.platformArrow} />
                  </div>
                  <p className={styles.platformBlurb}>{p.blurb}</p>
                  <div className={styles.platformStat}>
                    <strong>{p.stat}</strong>
                    <span>{p.statLabel}</span>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>

        {/* Community strip */}
        <ScrollReveal direction="up" duration={900}>
          <section className={styles.community}>
            <div className={styles.communityHead}>
              <h2 className={styles.communityTitle}>
                <Star size={20} className={styles.communityStar} /> Tagged by you
              </h2>
              <p className={styles.communitySub}>
                Real fits from the #GRAVITYStyle community. Tag us to get featured.
              </p>
            </div>
            <div className={styles.communityRail}>
              {community.map((c, i) => (
                <div key={i} className={styles.communityCard}>
                  <Image src={c.image} alt={`Community fit ${i + 1}`} fill sizes="(max-width: 640px) 40vw, 180px" className={styles.communityImg} />
                  <span className={styles.communityOverlay}>
                    <Heart size={12} fill="currentColor" strokeWidth={0} /> {c.likes}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </ScrollReveal>
      </div>
    </div>
  );
}
