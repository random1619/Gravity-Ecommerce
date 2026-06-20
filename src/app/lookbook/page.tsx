'use client'

import React, { useState } from 'react'
import styles from './page.module.css'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import Link from 'next/link'

interface LookItem {
  id: string
  name: string
  price: number
  imageUrl: string
  link: string
}

interface Look {
  id: number
  title: string
  tag: string
  image: string
  items: LookItem[]
}

const lookbookData: Look[] = [
  {
    id: 1,
    title: 'Minimalist Drip',
    tag: 'CAMPUS DAILY',
    image: '/look1.png',
    items: [
      { id: '1', name: 'Oversized Graffiti Tee', price: 699, imageUrl: '/product-tee.png', link: '/product/1' },
      { id: '2', name: 'Acid Wash Cargos', price: 999, imageUrl: '/product-cargos.png', link: '/product/2' }
    ]
  },
  {
    id: 2,
    title: 'Desert Breeze Fit',
    tag: 'STREET EDITORIAL',
    image: '/look2.png',
    items: [
      { id: '3', name: 'Desert Storm Hoodie', price: 1299, imageUrl: '/product-hoodie.png', link: '/product/3' },
      { id: '6', name: 'Basic Black Beanie', price: 299, imageUrl: '/product-acc.png', link: '/product/6' }
    ]
  },
  {
    id: 3,
    title: 'Distressed Indigo Look',
    tag: 'WINTER VIBE',
    image: '/look3.png',
    items: [
      { id: '10', name: 'Distressed Denim Jacket', price: 1499, imageUrl: '/product-jacket.png', link: '/product/10' },
      { id: '7', name: 'Silver Chain Necklace', price: 399, imageUrl: '/product-acc.png', link: '/product/7' }
    ]
  }
]

export default function LookbookPage() {
  const [selectedLook, setSelectedLook] = useState<Look | null>(null)

  return (
    <div className={styles.lookbookPage}>
      <div className="container">
        <Breadcrumbs />
        
        <header className={styles.header}>
          <h1 className={styles.title}>STYLE EDITORIAL &apos;26</h1>
          <p className={styles.subtitle}>
            Explore our curated streetwear combinations. Click any look to shop the exact fits.
          </p>
        </header>

        <div className={styles.grid}>
          {lookbookData.map(look => (
            <div key={look.id} className={styles.lookCard} onClick={() => setSelectedLook(look)}>
              <div className={styles.imageWrapper}>
                <img src={look.image} alt={look.title} className={styles.lookImage} />
                <div className={styles.overlay}>
                  <div className={styles.cardHeader}>
                    <span className={styles.tag}>{look.tag}</span>
                    <h2 className={styles.lookTitle}>{look.title}</h2>
                  </div>
                  <button className={styles.shopBtn}>Shop the Look →</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal for Shopping Look Items */}
        {selectedLook && (
          <Modal isOpen={!!selectedLook} onClose={() => setSelectedLook(null)}>
            <div className={styles.modalContent}>
              <h2 className={styles.modalTitle}>Shop the &quot;{selectedLook.title}&quot; Fit</h2>
              <p className={styles.modalSubtitle}>Curated pieces for this vibe:</p>
              
              <div className={styles.itemsList}>
                {selectedLook.items.map(item => (
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
    </div>
  )
}
