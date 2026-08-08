'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { readStorage, isArray } from '@/lib/storage';

export interface CartItem {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    size: string;
    quantity: number;
    category: string;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (item: Omit<CartItem, 'quantity'>) => void;
    removeFromCart: (id: string, size: string) => void;
    updateQuantity: (id: string, size: string, quantity: number) => void;
    clearCart: () => void;
    cartCount: number;
    cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isInitialized, setIsInitialized] = useState(false);

    // Load cart from localStorage on mount. Validated: a corrupted or
    // wrong-shaped value falls back to an empty cart instead of crashing
    // the `.reduce` calls below.
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setItems(readStorage<CartItem[]>('gravity-cart', [], isArray as (v: unknown) => v is CartItem[]));
        setIsInitialized(true);
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem('gravity-cart', JSON.stringify(items));
        }
    }, [items, isInitialized]);

    const addToCart = (item: Omit<CartItem, 'quantity'>) => {
        setItems(currentItems => {
            // Check if item with same id and size already exists
            const existingItemIndex = currentItems.findIndex(
                i => i.id === item.id && i.size === item.size
            );

            if (existingItemIndex > -1) {
                // Update quantity of existing item
                const updatedItems = [...currentItems];
                updatedItems[existingItemIndex].quantity += 1;
                return updatedItems;
            } else {
                // Add new item
                return [...currentItems, { ...item, quantity: 1 }];
            }
        });
    };

    const removeFromCart = (id: string, size: string) => {
        setItems(currentItems =>
            currentItems.filter(item => !(item.id === id && item.size === size))
        );
    };

    const updateQuantity = (id: string, size: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(id, size);
            return;
        }

        setItems(currentItems =>
            currentItems.map(item =>
                item.id === id && item.size === size
                    ? { ...item, quantity }
                    : item
            )
        );
    };

    const clearCart = () => {
        setItems([]);
    };

    const cartCount = items.reduce((total, item) => total + item.quantity, 0);
    const cartTotal = items.reduce((total, item) => total + item.price * item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                items,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                cartCount,
                cartTotal,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
