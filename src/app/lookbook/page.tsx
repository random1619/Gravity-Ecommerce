'use client';

import React, { useState, useRef, useCallback } from 'react';
import styles from './page.module.css';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import Image from 'next/image';
import ScrollStory from '@/components/motion/ScrollStory';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

interface LookItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  link: string;
  top?: string;
  left?: string;
}

interface Look {
  id: number;
  title: string;
  tag: string;
  image: string;
  items: LookItem[];
}

const lookbookData: Look[] = [
  {
    id: 1,
    title: 'Minimalist Drip',
    tag: 'CAMPUS DAILY',
    image: '/look1.png',
    items: [
      { id: '1', name: 'Oversized Graffiti Tee', price: 699, imageUrl: '/product-tee-premium.png', link: '/product/1', top: '35%', left: '42%' },
      { id: '2', name: 'Acid Wash Cargos', price: 999, imageUrl: '/product-cargos-premium.png', link: '/product/2', top: '65%', left: '48%' },
    ],
  },
  {
    id: 2,
    title: 'Desert Breeze Fit',
    tag: 'STREET EDITORIAL',
    image: '/look2.png',
    items: [
      { id: '3', name: 'Desert Storm Hoodie', price: 1299, imageUrl: '/product-hoodie-premium.png', link: '/product/3', top: '40%', left: '48%' },
      { id: '6', name: 'Basic Black Beanie', price: 299, imageUrl: '/variants/product-6-black.png', link: '/product/6', top: '15%', left: '50%' },
    ],
  },
  {
    id: 3,
    title: 'Distressed Indigo Look',
    tag: 'WINTER VIBE',
    image: '/look3.png',
    items: [
      { id: '10', name: 'Distressed Denim Jacket', price: 1499, imageUrl: '/product-jacket-premium.png', link: '/product/10', top: '38%', left: '45%' },
      { id: '7', name: 'Silver Chain Necklace', price: 399, imageUrl: '/variants/product-7-silver.png', link: '/product/7', top: '25%', left: '50%' },
    ],
  },
  {
    id: 4,
    title: 'Techwear Tactical Fit',
    tag: 'CYBER STREET',
    image: '/look4.png',
    items: [
      { id: '23', name: 'Techwear Windbreaker', price: 1999, imageUrl: '/variants/product-23-teal.png', link: '/product/23', top: '35%', left: '46%' },
      { id: '14', name: 'Streetwear Utility Vest', price: 1299, imageUrl: '/variants/product-14-olive.png', link: '/product/14', top: '48%', left: '50%' },
    ],
  },
];

const ISSUE = 'Nº 26';
// The divider doubles as the table of contents — cycle the actual look titles.
const MARQUEE_WORDS = lookbookData.map((l) => l.title);

export default function LookbookPage() {
  const [selectedLook, setSelectedLook] = useState<Look | null>(null);
  const [progress, setProgress] = useState(0);
  const storyRef = useRef<HTMLDivElement>(null);

  // Scroll-driven parallax: images drift against the track's travel direction.
  // Runs on GSAP's scrub tick — direct style writes, no React re-render.
  const handleProgress = useCallback((p: number) => {
    setProgress(p);
    const root = storyRef.current;
    if (!root) return;
    const vw = window.innerWidth;
    root.querySelectorAll<HTMLElement>('[data-parallax-img]').forEach((img) => {
      const panel = img.closest('article');
      if (!panel) return;
      const rect = panel.getBoundingClientRect();
      // -1 (entering right) → 0 (centered) → +1 (exited left)
      const offset = (rect.left + rect.width / 2 - vw / 2) / vw;
      img.style.transform = `translateX(${offset * -6}%) scale(1.15)`;

      // Counter-parallax: the caption drifts the opposite way at a third of the
      // image's travel, so text and photo separate in depth as the panel moves.
      const caption = panel.querySelector<HTMLElement>('[data-parallax-caption]');
      if (caption) caption.style.transform = `translateX(${offset * 2}%)`;
    });
  }, []);

  const activeIndex = Math.min(
    lookbookData.length - 1,
    Math.floor(progress * lookbookData.length)
  );

  // Jump the window scroll so the pinned track lands on chapter `index`.
  // The pin maps progress 0→1 across (trackWidth − viewport); chapter i sits at
  // progress i / (N+1) — there are N looks plus the closing "Fin." panel.
  const scrollToChapter = useCallback((index: number) => {
    const root = storyRef.current;
    if (!root) return;
    const track = root.querySelector<HTMLElement>('[class*="track"]');
    if (!track) return;
    const pinStart = root.getBoundingClientRect().top + window.scrollY;
    const distance = Math.max(0, track.scrollWidth - window.innerWidth);
    const chapters = lookbookData.length + 1; // looks + Fin.
    const target = pinStart + (index / chapters) * distance;
    window.scrollTo({ top: target, behavior: 'smooth' });
  }, []);

  const lookTotal = (look: Look) => look.items.reduce((sum, i) => sum + i.price, 0);

  return (
    <div className={styles.lookbookPage}>
      <div className="container">
        <Breadcrumbs />

        <header className={styles.header}>
          <div className={styles.issueRow}>
            <span className={styles.issueBadge}>The Issue</span>
            <span className={styles.issueNumber}>{ISSUE}</span>
            <span className={styles.issueSeason}>AW &apos;26</span>
          </div>
          <h1 className={styles.masthead}>
            <span className={styles.mastheadLine}>Style</span>
            <span className={`${styles.mastheadLine} ${styles.mastheadOutline}`}>Editorial</span>
          </h1>
          <p className={styles.subtitle}>
            Four fits, curated for the semester. Scroll, the rack slides sideways.
            Hover the pins to inspect each garment.
          </p>
          <div className={styles.scrollHint} aria-hidden>
            <span className={styles.scrollHintLine} />
            <span>Scroll</span>
          </div>
        </header>
      </div>

      {/* Marquee divider between masthead and gallery */}
      <div className={styles.marquee} aria-hidden>
        <div className={styles.marqueeTrack}>
          {[0, 1].map((copy) => (
            <div className={styles.marqueeGroup} key={copy}>
              {MARQUEE_WORDS.map((word) => (
                <React.Fragment key={`${copy}-${word}`}>
                  <span className={styles.marqueeWord}>{word}</span>
                  <span className={styles.marqueeDot}>✦</span>
                </React.Fragment>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Horizontal pin-scroll gallery. Reduced motion → vertical stack automatically.
          data-lookbook-story is read by Experience.tsx to track section progress. */}
      <div data-lookbook-story style={{ display: 'contents' }}>
        <div ref={storyRef}>
          <ScrollStory className={styles.story} trackClassName={styles.track} onProgress={handleProgress}>
            {lookbookData.map((look, index) => (
              <article key={look.id} className={styles.panel}>
                <div className={styles.imageWrapper}>
                  <div className={styles.imageClip}>
                    <Image
                      src={look.image}
                      alt={look.title}
                      fill
                      sizes="80vw"
                      priority={index === 0}
                      className={styles.lookImage}
                      data-parallax-img
                    />
                  </div>

                  {/* Giant outlined index numeral, drifting with the panel */}
                  <span className={styles.panelNumeral} aria-hidden>
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  {look.items.map((item) => (
                    <div
                      key={item.id}
                      className={styles.hotspot}
                      style={{ top: item.top, left: item.left }}
                      tabIndex={0}
                      role="button"
                      aria-label={`${item.name}, ₹${item.price} - view product`}
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          e.stopPropagation();
                          setSelectedLook(look);
                        }
                      }}
                    >
                      <div className={styles.pulsePin} />
                      <div className={`${styles.hotspotTooltip} ${parseFloat(item.left || '50') > 55 ? styles.tooltipLeft : ''}`}>
                        <Image src={item.imageUrl} alt="" width={40} height={40} className={styles.tooltipImg} />
                        <div className={styles.tooltipMeta}>
                          <span className={styles.tooltipName}>{item.name}</span>
                          <span className={styles.tooltipPrice}>₹{item.price}</span>
                        </div>
                        <Link href={item.link} className={styles.tooltipLink} aria-label={`View ${item.name}`}>
                          <ArrowUpRight size={14} aria-hidden />
                        </Link>
                      </div>
                    </div>
                  ))}

                  <div className={styles.overlay} onClick={() => setSelectedLook(look)}>
                    <div className={styles.cardContent} data-parallax-caption>
                      <div className={styles.cardHeader}>
                        <span className={styles.tag}>{look.tag}</span>
                        <h2 className={styles.lookTitle}>{look.title}</h2>
                      </div>
                      <div className={styles.cardFooter}>
                        <div className={styles.footerMeta}>
                          <span className={styles.pieceCount}>{look.items.length} pieces</span>
                          <span className={styles.lookTotal}>₹{lookTotal(look).toLocaleString('en-IN')}</span>
                        </div>
                        <button className={styles.shopBtn}>
                          Shop the Look
                          <ArrowRight size={16} className={styles.shopBtnIcon} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}

            {/* Closing panel — end of the rack */}
            <article className={`${styles.panel} ${styles.endPanel}`}>
              <div className={styles.endPanelInner}>
                <span className={styles.endKicker}>Fin.</span>
                <h2 className={styles.endTitle}>Build your own fit</h2>
                <p className={styles.endText}>
                  Every piece in this issue is in stock. Mix, match, make it yours.
                </p>
                <Link href="/shop" className={styles.endCta}>
                  Shop All Products
                  <ArrowRight size={18} />
                </Link>
                <Link href="/collections" className={styles.endSecondary}>
                  Browse New Drops
                </Link>
                <div className={styles.nextIssue}>
                  <span className={styles.nextIssueRule} aria-hidden />
                  <p className={styles.nextIssueText}>
                    Next issue — <em>Nº 27</em>, &lsquo;Monsoon Cargo&rsquo;, drops with the first rain.
                  </p>
                </div>
              </div>
            </article>
          </ScrollStory>
        </div>
      </div>

      {/* Filmstrip progress rail — syncs to GSAP pin progress, chapters jump the track */}
      <nav className={styles.rail} aria-label="Lookbook chapters">
        <span className={styles.railLabel}>
          Look <span className={styles.railFolio}>{String(activeIndex + 1).padStart(2, '0')}</span>
          <span className={styles.railFolioTotal}> / {String(lookbookData.length).padStart(2, '0')}</span>
        </span>
        <div className={styles.railChapters}>
          {lookbookData.map((look, index) => (
            <button
              key={look.id}
              type="button"
              onClick={() => scrollToChapter(index)}
              aria-current={index === activeIndex ? 'true' : undefined}
              className={`${styles.railChapter} ${index === activeIndex ? styles.railChapterActive : ''} ${index < activeIndex ? styles.railChapterDone : ''}`}
            >
              <span className="sr-only">Go to look {index + 1}: {look.title}</span>
              <span aria-hidden="true" style={{ display: 'contents' }}>{String(index + 1).padStart(2, '0')}</span>
            </button>
          ))}
        </div>
        <div className={styles.railTrack} aria-hidden>
          <div className={styles.railFill} style={{ transform: `scaleX(${progress})` }} />
        </div>
      </nav>

      {selectedLook && (
        <Modal isOpen={!!selectedLook} onClose={() => setSelectedLook(null)}>
          <div className={styles.modalContent}>
            <span className={styles.modalTag}>{selectedLook.tag}</span>
            <h2 className={styles.modalTitle}>Shop the &quot;{selectedLook.title}&quot; Fit</h2>
            <p className={styles.modalSubtitle}>Curated pieces for this vibe:</p>
            <div className={styles.itemsList}>
              {selectedLook.items.map((item) => (
                <div key={item.id} className={styles.itemRow}>
                  <div className={styles.itemImageWrapper}>
                    <Image src={item.imageUrl} alt={item.name} fill sizes="60px" className={styles.itemImage} />
                  </div>
                  <div className={styles.itemMeta}>
                    <h3>{item.name}</h3>
                    <p>₹{item.price}</p>
                  </div>
                  <Link href={item.link}>
                    <Button variant="primary" size="sm">View Item</Button>
                  </Link>
                </div>
              ))}
            </div>
            <div className={styles.modalTotal}>
              <span>Full fit</span>
              <strong>₹{lookTotal(selectedLook).toLocaleString('en-IN')}</strong>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
