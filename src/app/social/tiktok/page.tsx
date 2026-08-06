'use client';

import React from 'react';
import Image from 'next/image';
import { Heart, MessageCircle, Share2, Play, ArrowUpRight, MoveRight } from 'lucide-react';
import styles from './TikTokRail.module.css';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import ScrollReveal from '@/components/motion/ScrollReveal';
import Marquee from '@/components/ui/Marquee';

interface Clip {
  id: number;
  image: string;
  caption: string;
  views: string;
  likes: string;
  comments: string;
}

const clips: Clip[] = [
  { id: 1, image: '/reel-2.png', caption: 'POV: the Acid Wash Cargos have a pocket for everything.', views: '1.2M', likes: '48k', comments: '1.2k' },
  { id: 2, image: '/reel-1.png', caption: 'GRWM: Graffiti Tee edition. 60 seconds, zero effort.', views: '890k', likes: '62k', comments: '2.1k' },
  { id: 3, image: '/reel-3.png', caption: 'That 350 GSM weight when you first put it on.', views: '2.1M', likes: '71k', comments: '3.4k' },
  { id: 4, image: '/look2.png', caption: 'Transition video but it is just the Desert Breeze fit.', views: '640k', likes: '29k', comments: '812' },
  { id: 5, image: '/reel-4.png', caption: 'Accessories check. Beanie + chain + tote = personality.', views: '980k', likes: '41k', comments: '1.5k' },
];

export default function TikTokPage() {
  return (
    <div className={styles.page}>
      <div className="container">
        <Breadcrumbs />

        <header className={styles.header}>
          <ScrollReveal direction="up" duration={700}>
            <span className={styles.eyebrow}>@gravity.drip</span>
            <h1 className={styles.title}>
              Sound on, <em>scroll sideways.</em>
            </h1>
            <p className={styles.subtitle}>
              The stuff that never makes the lookbook. GRWMs, drop-day chaos, and fits
              in motion. Drag through the phones.
            </p>
            <span className={styles.hint}>
              Scroll <MoveRight size={14} />
            </span>
            <div style={{ marginTop: 'var(--spacing-6)' }}>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--cta btn--lg"
              >
                Follow on TikTok
                <ArrowUpRight size={18} />
              </a>
            </div>
          </ScrollReveal>
        </header>
      </div>

      <div className={styles.rail} role="list" aria-label="TikTok clips">
        {clips.map((clip) => (
          <div key={clip.id} className={styles.phone} role="listitem">
            <div className={styles.screen}>
              <Image
                src={clip.image}
                alt={clip.caption}
                fill
                sizes="260px"
              />

              {/* Right-side action column, TikTok-style */}
              <div className={styles.actions}>
                <div className={styles.actionBtn}>
                  <span className={styles.actionCircle}><Heart size={18} /></span>
                  {clip.likes}
                </div>
                <div className={styles.actionBtn}>
                  <span className={styles.actionCircle}><MessageCircle size={18} /></span>
                  {clip.comments}
                </div>
                <div className={styles.actionBtn}>
                  <span className={styles.actionCircle}><Share2 size={18} /></span>
                  Share
                </div>
              </div>

              {/* Bottom caption + view count */}
              <div className={styles.captionBar}>
                <span className={styles.viewCount}><Play size={12} /> {clip.views}</span>
                <p className={styles.caption}>{clip.caption}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.marqueeWrap}>
        <Marquee
          texts={[
            'DUET YOUR DROP',
            'TAG @GRAVITY.DRIP',
            'BEST CLIP WINS A FULL FIT',
            'NEW REELS EVERY FRIDAY',
          ]}
        />
      </div>
    </div>
  );
}
