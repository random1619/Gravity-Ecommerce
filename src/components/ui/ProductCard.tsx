'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Check, Eye } from 'lucide-react';
import styles from './ProductCard.module.scss';
import Button from './Button';
import Tilt from '@/components/motion/Tilt';
import { useAuth } from '@/lib/AuthContext';
import { useCart } from '@/lib/CartContext';

/** Kowalski spring for the card press/lift. */
const spring = { type: 'spring', stiffness: 420, damping: 28, mass: 0.6 } as const;

interface ProductCardProps {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    imageUrl: string;
    category: string;
    isNew?: boolean;
    onQuickView?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
    id,
    name,
    price,
    originalPrice,
    imageUrl,
    category,
    isNew,
    onQuickView,
}) => {
    const { isAuthenticated } = useAuth();
    const { addToCart } = useCart();
    const router = useRouter();
    const [added, setAdded] = useState(false);
    const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : null;

    // Quick add: one tap, default size M (the cart merges same-id+size lines),
    // then route to the bag page — the bag is a page, not an overlay.
    const handleQuickAdd = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isAuthenticated) {
            alert('Please login to add items to your bag');
            return;
        }
        addToCart({ id, name, price, imageUrl, size: 'M', category });
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1600);
        router.push('/cart');
    };

    return (
        <Tilt max={5} className={styles.cardTilt}>
        <motion.div
            className={styles.card}
            data-cursor-text="SHOP"
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.985 }}
            transition={spring}
        >
            <div className={styles.imageWrapper}>
                <Link href={`/product/${id}`}>
                    <Image
                        src={imageUrl}
                        alt={name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className={styles.image}
                    />
                </Link>
                {isNew && <span className={styles.badge}>NEW DROP</span>}

                {/* Floating Glassmorphic Quick View Trigger */}
                <motion.button
                    className={styles.quickViewBtn}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onQuickView?.();
                    }}
                    title="Quick View"
                    aria-label={`Quick view ${name}`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    transition={spring}
                >
                    <Eye size={16} />
                </motion.button>

                <div className={styles.overlay}>
                    <Button
                        variant="secondary"
                        size="sm"
                        className={styles.quickAdd}
                        onClick={handleQuickAdd}
                        aria-label={`Quick add ${name} to bag, size M`}
                        aria-live="polite"
                    >
                        {added ? (
                            <>
                                <Check size={14} aria-hidden /> Added
                            </>
                        ) : (
                            'Quick Add'
                        )}
                    </Button>
                </div>
            </div>

            <div className={styles.info}>
                <p className={styles.category}>{category}</p>
                <Link href={`/product/${id}`}>
                    <h3 className={styles.name}>{name}</h3>
                </Link>

                <div className={styles.priceRow}>
                    <span className={styles.price}>₹{price}</span>
                    {originalPrice && <span className={styles.oldPrice}>₹{originalPrice}</span>}
                    {discount && <span className={styles.discount}>{discount}% OFF</span>}
                </div>
            </div>
        </motion.div>
        </Tilt>
    );
};

export default ProductCard;
