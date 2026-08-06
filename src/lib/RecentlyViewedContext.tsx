'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { readStorage, isArray } from '@/lib/storage'

interface RecentProduct {
  id: string
  name: string
  price: number
  originalPrice?: number
  imageUrl: string
  category: string
  isNew?: boolean
}

interface RecentlyViewedContextType {
  recentlyViewed: RecentProduct[]
  addToRecentlyViewed: (product: RecentProduct) => void
  clearRecentlyViewed: () => void
}

const RecentlyViewedContext = createContext<RecentlyViewedContextType | undefined>(undefined)

export function RecentlyViewedProvider({ children }: { children: ReactNode }) {
  const [recentlyViewed, setRecentlyViewed] = useState<RecentProduct[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

  // Load from localStorage on mount (shape-validated).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRecentlyViewed(readStorage<RecentProduct[]>('gravity-recently-viewed', [], isArray as (v: unknown) => v is RecentProduct[]))
    setIsInitialized(true)
  }, [])

  // Save to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('gravity-recently-viewed', JSON.stringify(recentlyViewed))
    }
  }, [recentlyViewed, isInitialized])

  const addToRecentlyViewed = (product: RecentProduct) => {
    setRecentlyViewed(prev => {
      // Remove if already exists
      const filtered = prev.filter(item => item.id !== product.id)
      // Add to beginning, keep max 12 items
      return [product, ...filtered].slice(0, 12)
    })
  }

  const clearRecentlyViewed = () => {
    setRecentlyViewed([])
  }

  return (
    <RecentlyViewedContext.Provider
      value={{
        recentlyViewed,
        addToRecentlyViewed,
        clearRecentlyViewed
      }}
    >
      {children}
    </RecentlyViewedContext.Provider>
  )
}

export function useRecentlyViewed() {
  const context = useContext(RecentlyViewedContext)
  if (context === undefined) {
    throw new Error('useRecentlyViewed must be used within a RecentlyViewedProvider')
  }
  return context
}
