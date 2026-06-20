'use client'

import { useState } from 'react'
import Modal from './Modal'
import styles from './SizeGuide.module.css'

interface SizeGuideProps {
  isOpen: boolean
  onClose: () => void
}

export default function SizeGuide({ isOpen, onClose }: SizeGuideProps) {
  const [selectedCategory, setSelectedCategory] = useState('tops')

  const categories = {
    tops: {
      name: 'Tops & Shirts',
      measurements: [
        { size: 'XS', chest: '32-34', waist: '24-26', hips: '34-36' },
        { size: 'S', chest: '34-36', waist: '26-28', hips: '36-38' },
        { size: 'M', chest: '36-38', waist: '28-30', hips: '38-40' },
        { size: 'L', chest: '38-41', waist: '30-33', hips: '40-43' },
        { size: 'XL', chest: '41-44', waist: '33-36', hips: '43-46' },
        { size: 'XXL', chest: '44-47', waist: '36-39', hips: '46-49' }
      ]
    },
    bottoms: {
      name: 'Pants & Jeans',
      measurements: [
        { size: 'XS', waist: '24-26', hips: '34-36', inseam: '30' },
        { size: 'S', waist: '26-28', hips: '36-38', inseam: '30' },
        { size: 'M', waist: '28-30', hips: '38-40', inseam: '31' },
        { size: 'L', waist: '30-33', hips: '40-43', inseam: '31' },
        { size: 'XL', waist: '33-36', hips: '43-46', inseam: '32' },
        { size: 'XXL', waist: '36-39', hips: '46-49', inseam: '32' }
      ]
    },
    shoes: {
      name: 'Footwear',
      measurements: [
        { size: 'US 5', eu: '35-36', uk: '2.5-3', cm: '22' },
        { size: 'US 6', eu: '36-37', uk: '3.5-4', cm: '23' },
        { size: 'US 7', eu: '37-38', uk: '4.5-5', cm: '24' },
        { size: 'US 8', eu: '38-39', uk: '5.5-6', cm: '25' },
        { size: 'US 9', eu: '39-40', uk: '6.5-7', cm: '26' },
        { size: 'US 10', eu: '40-41', uk: '7.5-8', cm: '27' },
        { size: 'US 11', eu: '41-42', uk: '8.5-9', cm: '28' }
      ]
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.sizeGuide}>
        <h2>Size Guide</h2>
        <p className={styles.subtitle}>Find your perfect fit with our detailed size charts</p>

        <div className={styles.categories}>
          {Object.entries(categories).map(([key, cat]) => (
            <button
              key={key}
              className={`${styles.categoryBtn} ${selectedCategory === key ? styles.active : ''}`}
              onClick={() => setSelectedCategory(key)}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.sizeTable}>
            <thead>
              <tr>
                <th>Size</th>
                {Object.keys(categories[selectedCategory as keyof typeof categories].measurements[0])
                  .filter(key => key !== 'size')
                  .map(key => (
                    <th key={key}>{key.charAt(0).toUpperCase() + key.slice(1)} (inches)</th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {categories[selectedCategory as keyof typeof categories].measurements.map((row, index) => (
                <tr key={index}>
                  <td className={styles.sizeCell}>{row.size}</td>
                  {Object.entries(row)
                    .filter(([key]) => key !== 'size')
                    .map(([, value], i) => (
                      <td key={i}>{value}</td>
                    ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.tips}>
          <h3>How to Measure</h3>
          <div className={styles.tipsList}>
            <div className={styles.tip}>
              <strong>Chest:</strong> Measure around the fullest part of your chest, keeping the tape horizontal.
            </div>
            <div className={styles.tip}>
              <strong>Waist:</strong> Measure around your natural waistline, keeping the tape comfortably loose.
            </div>
            <div className={styles.tip}>
              <strong>Hips:</strong> Measure around the fullest part of your hips, keeping the tape horizontal.
            </div>
            <div className={styles.tip}>
              <strong>Between Sizes:</strong> If you are between sizes, we recommend sizing up for a more comfortable fit.
            </div>
          </div>
        </div>

        <div className={styles.help}>
          <p>Still need help finding your size?</p>
          <a href="/contact" className={styles.contactLink}>Contact our support team</a>
        </div>
      </div>
    </Modal>
  )
}
