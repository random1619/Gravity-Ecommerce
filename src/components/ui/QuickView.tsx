'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import styles from './QuickView.module.css';
import Modal from './Modal';
import Button from './Button';
import { useCart } from '@/lib/CartContext';
import { useAuth } from '@/lib/AuthContext';
import { recordProductView } from '@/lib/recentlyViewed';
import { Check } from 'lucide-react';

interface QuickViewProps {
    isOpen: boolean;
    onClose: () => void;
    onLoginRequired?: () => void;
    product: {
        id: string;
        name: string;
        price: number;
        originalPrice?: number;
        imageUrl: string;
        category: string;
        sizes?: string[];
        description?: string;
    } | null;
}

const QuickView: React.FC<QuickViewProps> = ({ isOpen, onClose, onLoginRequired, product }) => {
    const { addToCart } = useCart();
    const { isAuthenticated } = useAuth();
    const [selectedSize, setSelectedSize] = useState<string>('');
    const [showSuccess, setShowSuccess] = useState(false);

    // Record the view for the shop page's recently-viewed rail
    useEffect(() => {
        if (isOpen && product) {
            recordProductView({
                id: product.id,
                name: product.name,
                price: product.price,
                imageUrl: product.imageUrl,
                category: product.category,
            });
        }
    }, [isOpen, product]);

    if (!product) return null;

    const handleAddToCart = () => {
        // Check if user is logged in
        if (!isAuthenticated) {
            onClose();
            if (onLoginRequired) {
                onLoginRequired();
            } else {
                alert('Please login to add items to your bag');
            }
            return;
        }

        if (!selectedSize) {
            alert('Please select a size');
            return;
        }

        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            imageUrl: product.imageUrl,
            size: selectedSize,
            category: product.category,
        });

        setShowSuccess(true);
        setTimeout(() => {
            setShowSuccess(false);
            setSelectedSize('');
            onClose();
        }, 1000);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className={styles.quickView}>
                <div className={styles.imageCol}>
                    <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                    />
                </div>
                <div className={styles.infoCol}>
                    <p className={styles.category}>{product.category}</p>
                    <h2 className={styles.name}>{product.name}</h2>
                    <div className={styles.priceRow}>
                        <span className={styles.price}>₹{product.price}</span>
                        {product.originalPrice && <span className={styles.oldPrice}>₹{product.originalPrice}</span>}
                    </div>
                    <p className={styles.description}>
                        {product.description || `Experience premium comfort with our signature ${product.category.toLowerCase()}. Designed for the perfect fit and ultimate style.`}
                    </p>

                    <div className={styles.sizes}>
                        <h4>Select Size</h4>
                        <div className={styles.sizeGrid}>
                            {(product.sizes || ['S', 'M', 'L', 'XL']).map(s => (
                                <button
                                    key={s}
                                    className={`${styles.sizeBtn} ${selectedSize === s ? styles.selected : ''}`}
                                    onClick={() => setSelectedSize(s)}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    <Button variant="primary" size="full" onClick={handleAddToCart}>
                        {showSuccess ? <><Check size={16} strokeWidth={2.5} style={{ marginRight: 6, verticalAlign: '-2px' }} />Added!</> : 'Add to Bag'}
                    </Button>
                    <Link href={`/product/${product.id}`} className={styles.detailsLink}>
                        View Full Details
                    </Link>
                </div>
            </div>
        </Modal>
    );
};

export default QuickView;
