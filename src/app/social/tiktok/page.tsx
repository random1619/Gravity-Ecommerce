'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { Heart, MessageCircle, Share2, Play, ArrowUpRight, MoveRight, Music2 } from 'lucide-react';
import styles from './TikTokRail.module.css';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import ScrollReveal from '@/components/motion/ScrollReveal';
import Marquee from '@/components/ui/Marquee';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface Clip {
  id: number;
  image: string;
  caption: string;
  views: string;
  likes: string;
  comments: string;
  track: string;
}

const clips: Clip[] = [
  { id: 1, image: '/reel-2.png', caption: 'POV: the Acid Wash Cargos have a pocket for everything.', views: '1.2M', likes: '48k', comments: '1.2k', track: 'original sound — gravity.drip' },
  { id: 2, image: '/reel-1.png', caption: 'GRWM: Graffiti Tee edition. 60 seconds, zero effort.', views: '890k', likes: '62k', comments: '2.1k', track: 'SPED UP MIX — campus edit' },
  { id: 3, image: '/reel-3.png', caption: 'That 350 GSM weight when you first put it on.', views: '2.1M', likes: '71k', comments: '3.4k', track: 'heavyweight anthem — gravity.drip' },
  { id: 4, image: '/look2.png', caption: 'Transition video but it is just the Desert Breeze fit.', views: '640k', likes: '29k', comments: '812', track: 'transition sound — desert breeze' },
  { id: 5, image: '/reel-4.png', caption: 'Accessories check. Beanie + chain + tote = personality.', views: '980k', likes: '41k', comments: '1.5k', track: 'accessories check — gravity.drip' },
];

export default function TikTokPage() {
  const reduced = useReducedMotion();
  const railRef = useRef<HTMLDivElement>(null);

  // --- Physical drag-to-scroll -------------------------------------------
  // Pointer Events + setPointerCapture, a short velocity history, momentum
  // projection on release, and progressive rubber-band resistance at the edges.
  const drag = useRef({
    active: false,
    startX: 0,
    startScroll: 0,
    lastX: 0,
    lastT: 0,
    velocity: 0,
    raf: 0,
    moved: false,
  });

  const maxScroll = useCallback(() => {
    const el = railRef.current;
    return el ? el.scrollWidth - el.clientWidth : 0;
  }, []);

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const el = railRef.current;
    if (!el) return;
    const d = drag.current;
    cancelAnimationFrame(d.raf);
    d.active = true;
    d.moved = false;
    d.startX = e.clientX;
    d.lastX = e.clientX;
    d.startScroll = el.scrollLeft;
    d.lastT = performance.now();
    d.velocity = 0;
    el.setPointerCapture(e.pointerId);
    el.classList.add(styles.dragging);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const el = railRef.current;
    const d = drag.current;
    if (!d.active || !el) return;

    const now = performance.now();
    const dt = Math.max(now - d.lastT, 1);
    // Track instantaneous velocity (px/ms) with light smoothing.
    d.velocity = 0.8 * d.velocity + 0.2 * ((e.clientX - d.lastX) / dt);
    d.lastX = e.clientX;
    d.lastT = now;

    const dx = e.clientX - d.startX;
    if (Math.abs(dx) > 4) d.moved = true;

    let next = d.startScroll - dx;
    const max = maxScroll();

    // Rubber-band the overshoot instead of a hard stop.
    if (next < 0) next = rubberBand(next, el.clientWidth);
    else if (next > max) next = max + rubberBand(next - max, el.clientWidth);

    el.scrollLeft = next;
  }, [maxScroll]);

  const endDrag = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const el = railRef.current;
    const d = drag.current;
    if (!d.active || !el) return;
    d.active = false;
    el.classList.remove(styles.dragging);
    if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);

    if (reduced) return;

    // Momentum: project where the flick is going, then ease the rest of the way.
    let v = -d.velocity * 14;
    let last = performance.now();
    const step = (now: number) => {
      const dt = Math.min(now - last, 32) / 16.7;
      last = now;
      v *= Math.pow(0.94, dt); // friction
      el.scrollLeft += v * dt;
      const max = maxScroll();
      const atEdge = el.scrollLeft <= 0 || el.scrollLeft >= max;
      if (Math.abs(v) > 0.4 && !atEdge) {
        d.raf = requestAnimationFrame(step);
      }
    };
    if (Math.abs(v) > 1.5) d.raf = requestAnimationFrame(step);
  }, [reduced, maxScroll]);

  useEffect(() => () => cancelAnimationFrame(drag.current.raf), []);

  // Prevent the click that follows a drag from firing on a card underneath.
  const preventClickAfterDrag = useCallback((e: React.MouseEvent) => {
    if (drag.current.moved) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, []);

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
              Drag <MoveRight size={14} className={styles.hintArrow} />
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

      {/* Edge fades signal more content on either side of the rail */}
      <div className={styles.railWrap}>
        <div
          ref={railRef}
          className={styles.rail}
          role="list"
          aria-label="TikTok clips"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onClickCapture={preventClickAfterDrag}
        >
          {clips.map((clip, i) => (
            <PhoneCard key={clip.id} clip={clip} index={i} reduced={reduced} />
          ))}
        </div>
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

/* Progressive boundary resistance — never a wall. */
function rubberBand(overshoot: number, dim: number): number {
  const d = Math.abs(overshoot);
  return Math.sign(overshoot) * ((d * dim * 0.55) / (dim + 0.55 * d));
}

function PhoneCard({ clip, index, reduced }: { clip: Clip; index: number; reduced: boolean }) {
  const [liked, setLiked] = useState(false);
  const [burstKey, setBurstKey] = useState(0);

  const toggleLike = () => {
    setLiked((v) => {
      if (!v) setBurstKey((k) => k + 1); // burst only on the like, not the unlike
      return !v;
    });
  };

  return (
    <div
      className={styles.phone}
      role="listitem"
      style={{ ['--i' as string]: index }}
      data-tilt={reduced ? undefined : index % 2 === 0 ? -1 : 1}
    >
      <div className={styles.screen}>
        <Image
          src={clip.image}
          alt={clip.caption}
          fill
          sizes="260px"
          draggable={false}
          priority={index < 2}
        />

        {/* Spinning track disc, top-right (TikTok's record) */}
        <span className={styles.trackDisc} aria-hidden="true">
          <Music2 size={13} />
        </span>

        {/* Right-side action column, TikTok-style */}
        <div className={styles.actions}>
          <button
            type="button"
            className={`${styles.actionBtn} ${liked ? styles.liked : ''}`}
            onClick={toggleLike}
            aria-pressed={liked}
            aria-label={liked ? `Unlike, ${clip.likes} likes` : `Like, ${clip.likes} likes`}
          >
            <span className={styles.actionCircle} key={burstKey}>
              <Heart size={18} fill={liked ? 'currentColor' : 'none'} />
            </span>
            {clip.likes}
          </button>
          <button type="button" className={styles.actionBtn} aria-label={`${clip.comments} comments`}>
            <span className={styles.actionCircle}><MessageCircle size={18} /></span>
            {clip.comments}
          </button>
          <button type="button" className={styles.actionBtn} aria-label="Share">
            <span className={styles.actionCircle}><Share2 size={18} /></span>
            Share
          </button>
        </div>

        {/* Bottom caption + view count + scrolling track */}
        <div className={styles.captionBar}>
          <span className={styles.viewCount}><Play size={12} /> {clip.views}</span>
          <p className={styles.caption}>{clip.caption}</p>
          <span className={styles.trackLine}>
            <Music2 size={11} />
            <span className={styles.trackTextWrap}>
              <span className={styles.trackText}>{clip.track}&nbsp;·&nbsp;{clip.track}</span>
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}

