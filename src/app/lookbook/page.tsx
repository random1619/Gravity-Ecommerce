'use client';

import React, { useState } from 'react';
import styles from './page.module.css';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import ScrollStory from '@/components/motion/ScrollStory';

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
];

export default function LookbookPage() {
  const [selectedLook, setSelectedLook] = useState<Look | null>(null);

  return (
    <div className={styles.lookbookPage}>
      <div className="container">
        <Breadcrumbs />

        <header className={styles.header}>
          <h1 className={styles.title}>STYLE EDITORIAL &apos;26</h1>
          <p className={styles.subtitle}>
            Scroll through our curated streetwear combinations. Hover over coordinates to inspect individual garments.
          </p>
        </header>
      </div>

      {/* Horizontal pin-scroll gallery. Reduced motion → vertical stack automatically.
          data-lookbook-story is read by Experience.tsx to track section progress. */}
      <div data-lookbook-story style={{ display: 'contents' }}>
        <ScrollStory className={styles.story} trackClassName={styles.track}>
          {lookbookData.map((look) => (
            <article key={look.id} className={styles.panel}>
              <div className={styles.imageWrapper}>
                <img src={look.image} alt={look.title} className={styles.lookImage} />
                {/* parallax depth layer: translucent accent glow for depth feel */}
                <div className={styles.depthLayer} aria-hidden="true" />

                {look.items.map((item) => (
                  <div
                    key={item.id}
                    className={styles.hotspot}
                    style={{ top: item.top, left: item.left }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className={styles.pulsePin} />
                    <div className={styles.hotspotTooltip}>
                      <img src={item.imageUrl} alt={item.name} className={styles.tooltipImg} />
                      <div className={styles.tooltipMeta}>
                        <span className={styles.tooltipName}>{item.name}</span>
                        <span className={styles.tooltipPrice}>₹{item.price}</span>
                      </div>
                      <Link href={item.link} className={styles.tooltipLink}>Inspect</Link>
                    </div>
                  </div>
                ))}

                <div className={styles.overlay} onClick={() => setSelectedLook(look)}>
                  <div className={styles.cardHeader}>
                    <span className={styles.tag}>{look.tag}</span>
                    <h2 className={styles.lookTitle}>{look.title}</h2>
                  </div>
                  <button className={styles.shopBtn}>Shop the Look →</button>
                </div>
              </div>
            </article>
          ))}
        </ScrollStory>
      </div>

      {selectedLook && (
        <Modal isOpen={!!selectedLook} onClose={() => setSelectedLook(null)}>
          <div className={styles.modalContent}>
            <h2 className={styles.modalTitle}>Shop the &quot;{selectedLook.title}&quot; Fit</h2>
            <p className={styles.modalSubtitle}>Curated pieces for this vibe:</p>
            <div className={styles.itemsList}>
              {selectedLook.items.map((item) => (
                <div key={item.id} className={styles.itemRow}>
                  <div className={styles.itemImageWrapper}>
                    <img src={item.imageUrl} alt={item.name} className={styles.itemImage} />
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
          </div>
        </Modal>
      )}
    </div>
  );
}
