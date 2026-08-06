'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { readStorage, isArray } from '@/lib/storage'

interface WishlistProduct {
  id: string
  name: string
  price: number
  originalPrice?: number
  imageUrl: string
  category: string
  isNew?: boolean
  description?: string
  sizes?: string[]
}

interface WishlistContextType {
  wishlist: WishlistProduct[]
  addToWishlist: (product: WishlistProduct) => void
  removeFromWishlist: (productId: string) => void
  isInWishlist: (productId: string) => boolean
  clearWishlist: () => void
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<WishlistProduct[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

  // Load wishlist from localStorage on mount (shape-validated).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setWishlist(readStorage<WishlistProduct[]>('gravity-wishlist', [], isArray as (v: unknown) => v is WishlistProduct[]))
    setIsInitialized(true)
  }, [])

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('gravity-wishlist', JSON.stringify(wishlist))
    }
  }, [wishlist, isInitialized])

  const addToWishlist = (product: WishlistProduct) => {
    setWishlist(prev => {
      if (prev.find(item => item.id === product.id)) {
        return prev
      }
      return [...prev, product]
    })
  }

  const removeFromWishlist = (productId: string) => {
    setWishlist(prev => prev.filter(item => item.id !== productId))
  }

  const isInWishlist = (productId: string) => {
    return wishlist.some(item => item.id === productId)
  }

  const clearWishlist = () => {
    setWishlist([])
  }

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}
