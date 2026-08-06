'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import styles from './page.module.css';
import Button from '@/components/ui/Button';
import ProductCard from '@/components/ui/ProductCard';
import Tilt from '@/components/motion/Tilt';
import QuickView from '@/components/ui/QuickView';
import { useCart } from '@/lib/CartContext';
import { useAuth } from '@/lib/AuthContext';
import LoginModal from '@/components/ui/LoginModal';
import ProductDistort from '@/components/three/scenes/ProductDistort';
import type { Product } from '@/lib/data';
import { useParams } from 'next/navigation';
import SplitTextReveal from '@/components/motion/SplitTextReveal';
import ScrollReveal from '@/components/motion/ScrollReveal';
import { Check, Heart } from 'lucide-react';

/** Kowalski springs — every interactive element presses and lifts through physics. */
const spring = {
    snappy: { type: 'spring', stiffness: 500, damping: 30, mass: 0.5 },
    gentle: { type: 'spring', stiffness: 380, damping: 26, mass: 0.7 },
} as const;

export default function ProductDetail() {
    const params = useParams();
    const idParam = params.id;
    const id = Array.isArray(idParam) ? idParam[0] : idParam;

    const { addToCart } = useCart();
    const { isAuthenticated } = useAuth();
    const [product, setProduct] = useState<Product | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);
    const [selectedSize, setSelectedSize] = useState('M');
    const [addedToCart, setAddedToCart] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

    React.useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch main product
                if (!id) {
                    setProduct(null);
                    return;
                }
                const pRes = await fetch(`/api/products/${id}`);
                const pData = (await pRes.json()) as Product;
                setProduct(pData);

                // Fetch related products (same category)
                if (pData.category) {
                    const rRes = await fetch(`/api/products?category=${pData.category}`);
                    const rData = (await rRes.json()) as Product[];
                    setRelatedProducts(rData.filter((p) => p.id !== id).slice(0, 3));
                }
            } catch (error) {
                console.error('Failed to fetch product data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleAddToCart = () => {
        if (!product) return;
        // Check if user is logged in
        if (!isAuthenticated) {
            setShowLoginModal(true);
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

        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2000);
    };

    if (loading) return <div className="container" style={{ padding: '100px', textAlign: 'center' }}>Loading product details...</div>;
    if (!product) return <div className="container" style={{ padding: '100px', textAlign: 'center' }}>Product not found.</div>;

    return (
        <div className={`container ${styles.productPage}`}>
            <QuickView
                isOpen={!!quickViewProduct}
                onClose={() => setQuickViewProduct(null)}
                onLoginRequired={() => setShowLoginModal(true)}
                product={quickViewProduct}
            />
            <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />

            <div className={styles.productLayout}>
                {/* Gallery Section */}
                <section className={styles.gallery}>
                    <Tilt max={3} className={styles.mainTilt}>
                        <motion.div
                            className={styles.mainImage}
                            whileHover={{ scale: 1.02 }}
                            transition={spring.gentle}
                        >
                            <ProductDistort
                                src={product.images?.[activeImage] || '/product-tee-premium.png'}
                                alt={product.name}
                            />
                        </motion.div>
                    </Tilt>
                    <div className={styles.thumbnails}>
                        {(product.images || []).map((img: string, idx: number) => (
                            <motion.button
                                key={idx}
                                className={`${styles.thumb} ${activeImage === idx ? styles.activeThumb : ''}`}
                                onClick={() => setActiveImage(idx)}
                                whileHover={{ y: -3 }}
                                whileTap={{ scale: 0.92 }}
                                transition={spring.snappy}
                            >
                                <Image src={img} alt={`${product.name} thumbnail ${idx}`} width={80} height={107} />
                            </motion.button>
                        ))}
                    </div>
                </section>

                {/* Info Section */}
                <section className={styles.info}>
                    <ScrollReveal direction="up" delay={80}>
                        <p className={styles.category}>{product.category}</p>
                    </ScrollReveal>
                    <h1 className={styles.name}><SplitTextReveal text={product.name} /></h1>
                    <ScrollReveal direction="up" delay={150}>
                        <div className={styles.priceRow}>
                            <span className={styles.price}>₹{product.price}</span>
                            <span className={styles.oldPrice}>₹{product.originalPrice}</span>
                            <span className={styles.discount}>Save ₹{product.originalPrice - product.price}</span>
                        </div>
                    </ScrollReveal>

                    <div className={styles.selector}>
                        <h3>Select Size</h3>
                        <div className={styles.sizeGrid}>
                            {(product.sizes || []).map((size: string) => (
                                <motion.button
                                    key={size}
                                    className={`${styles.sizeBtn} ${selectedSize === size ? styles.activeSize : ''}`}
                                    onClick={() => setSelectedSize(size)}
                                    whileHover={{ y: -2 }}
                                    whileTap={{ scale: 0.9 }}
                                    transition={spring.snappy}
                                >
                                    {size}
                                </motion.button>
                            ))}
                        </div>
                        <button className={styles.sizeGuide}>View Size Guide</button>
                    </div>

                    <div className={styles.actions}>
                        <Button variant="primary" size="lg" className={styles.addToCart} onClick={handleAddToCart}>
                            {addedToCart ? <><Check size={18} strokeWidth={2.5} style={{ marginRight: 6, verticalAlign: '-3px' }} />Added to Cart</> : 'Add to Cart'}
                        </Button>
                        <Button variant="outline" size="lg" className={styles.wishlist} aria-label="Add to wishlist"><Heart size={20} strokeWidth={1.75} /></Button>
                    </div>

                    <div className={styles.details}>
                        <div className={styles.detailItem}>
                            <h4>Fabric & Care</h4>
                            <p>{product.fabric}</p>
                            <p>{product.care}</p>
                        </div>
                        <div className={styles.detailItem}>
                            <h4>Product Description</h4>
                            <p>{product.description}</p>
                        </div>
                    </div>
                </section>
            </div>

            {/* Reviews Section */}
            <section className={styles.reviewsSection}>
                <h2>What Students Say</h2>
                <div className={styles.reviewsGrid}>
                    {(product.reviews || []).map((review) => (
                        <motion.div
                            key={review.id}
                            className={styles.reviewCard}
                            whileHover={{ y: -4 }}
                            transition={spring.gentle}
                        >
                            <div className={styles.rating}>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</div>
                            <p className={styles.comment}>&quot;{review.comment}&quot;</p>
                            <p className={styles.user}>- {review.user}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <section className={styles.relatedSection}>
                    <h2>You Might Also Like</h2>
                    <div className={styles.relatedGrid}>
                        {relatedProducts.map(p => (
                            <ProductCard
                                key={p.id}
                                {...p}
                                onQuickView={() => setQuickViewProduct(p)}
                            />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
