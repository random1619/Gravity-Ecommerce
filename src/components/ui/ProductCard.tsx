'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Eye } from 'lucide-react';
import styles from './ProductCard.module.scss';
import Button from './Button';

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
    const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : null;

    return (
        <div className={styles.card} data-cursor-text="SHOP">
            <div className={styles.imageWrapper}>
                <Link href={`/product/${id}`}>
                    <Image
                        src={imageUrl}
                        alt={name}
                        className={styles.image}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                </Link>
                {isNew && <span className={styles.badge}>NEW DROP</span>}
                
                {/* Floating Glassmorphic Quick View Trigger */}
                <button
                    className={styles.quickViewBtn}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onQuickView?.();
                    }}
                    title="Quick View"
                    aria-label={`Quick view ${name}`}
                >
                    <Eye size={16} />
                </button>

                <div className={styles.overlay}>
                    <Button
                        variant="secondary"
                        size="sm"
                        className={styles.quickAdd}
                        onClick={(e) => {
                            e.preventDefault();
                            onQuickView?.();
                        }}
                    >
                        Quick View
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
        </div>
    );
};

export default ProductCard;
