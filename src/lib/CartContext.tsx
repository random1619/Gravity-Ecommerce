'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

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
    isCartOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isInitialized, setIsInitialized] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const openCart = () => setIsCartOpen(true);
    const closeCart = () => setIsCartOpen(false);

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('gravity-cart');
        if (savedCart) {
            try {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setItems(JSON.parse(savedCart));
            } catch (error) {
                console.error('Failed to parse cart from localStorage', error);
            }
        }
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
                // Update quantity of existing item (immutable — a mutated array
                // keeps the same reference and React may skip the re-render)
                return currentItems.map((i, index) =>
                    index === existingItemIndex ? { ...i, quantity: i.quantity + 1 } : i
                );
            } else {
                // Add new item
                return [...currentItems, { ...item, quantity: 1 }];
            }
        });
        openCart();
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
                isCartOpen,
                openCart,
                closeCart,
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
