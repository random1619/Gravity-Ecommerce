'use client'

import { useState } from 'react'
import styles from './ProductFilter.module.css'

interface FilterOptions {
  category: string[]
  priceRange: { min: number; max: number }
  sortBy: string
  inStock: boolean
}

interface ProductFilterProps {
  onFilterChange: (filters: FilterOptions) => void
  categories: string[]
}

export default function ProductFilter({ onFilterChange, categories }: ProductFilterProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 })
  const [sortBy, setSortBy] = useState('featured')
  const [inStock, setInStock] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const handleCategoryToggle = (category: string) => {
    const updated = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category]

    setSelectedCategories(updated)
    applyFilters({ category: updated })
  }

  const handlePriceChange = (min: number, max: number) => {
    setPriceRange({ min, max })
    applyFilters({ priceRange: { min, max } })
  }

  const handleSortChange = (value: string) => {
    setSortBy(value)
    applyFilters({ sortBy: value })
  }

  const handleStockToggle = () => {
    setInStock(!inStock)
    applyFilters({ inStock: !inStock })
  }

  const applyFilters = (updates: Partial<FilterOptions>) => {
    onFilterChange({
      category: selectedCategories,
      priceRange,
      sortBy,
      inStock,
      ...updates
    })
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setPriceRange({ min: 0, max: 1000 })
    setSortBy('featured')
    setInStock(false)
    onFilterChange({
      category: [],
      priceRange: { min: 0, max: 1000 },
      sortBy: 'featured',
      inStock: false
    })
  }

  return (
    <div className={styles.filterContainer}>
      <div className={styles.filterHeader}>
        <button
          className={styles.filterToggle}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span>Filters</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>

        <select
          className={styles.sortSelect}
          value={sortBy}
          onChange={(e) => handleSortChange(e.target.value)}
        >
          <option value="featured">Featured</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="newest">Newest</option>
          <option value="rating">Highest Rated</option>
        </select>
      </div>

      <div className={`${styles.filterPanel} ${isOpen ? styles.open : ''}`}>
        <div className={styles.filterGroup}>
          <div className={styles.filterGroupHeader}>
            <h3>Category</h3>
            {selectedCategories.length > 0 && (
              <button onClick={clearFilters} className={styles.clearBtn}>
                Clear All
              </button>
            )}
          </div>
          <div className={styles.checkboxGroup}>
            {categories.map(category => (
              <label key={category} className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={() => handleCategoryToggle(category)}
                />
                <span>{category}</span>
              </label>
            ))}
          </div>
        </div>

        <div className={styles.filterGroup}>
          <h3>Price Range</h3>
          <div className={styles.priceInputs}>
            <input
              type="number"
              placeholder="Min"
              value={priceRange.min}
              onChange={(e) => handlePriceChange(Number(e.target.value), priceRange.max)}
              className={styles.priceInput}
            />
            <span>—</span>
            <input
              type="number"
              placeholder="Max"
              value={priceRange.max}
              onChange={(e) => handlePriceChange(priceRange.min, Number(e.target.value))}
              className={styles.priceInput}
            />
          </div>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.checkbox}>
            <input
              type="checkbox"
              checked={inStock}
              onChange={handleStockToggle}
            />
            <span>In Stock Only</span>
          </label>
        </div>
      </div>
    </div>
  )
}
