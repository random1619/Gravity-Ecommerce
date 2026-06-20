'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './HeroSlider.module.css';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';


const slides = [
    {
        id: 1,
        image: '/slider/slide1_v2.png',
        title: 'NEW ARRIVALS',
        subtitle: 'Fresh styles for campus life.',
        cta: 'Shop Now',
        link: '/shop?category=new',
        tag: 'Just Dropped',
    },
    {
        id: 2,
        image: '/slider/slide2_v2.png',
        title: 'UNDER RS. 999',
        subtitle: 'Budget fits with premium energy.',
        cta: 'Explore Deals',
        link: '/shop?maxPrice=999',
        tag: 'Best Value',
    },
    {
        id: 3,
        image: '/slider/slide3_v2.png',
        title: 'STUDENT DISCOUNT',
        subtitle: 'Extra 20% off every drop.',
        cta: 'Verify Now',
        link: '/discount',
        tag: 'Exclusive',
    },
    {
        id: 4,
        image: '/slider/slide4_v2.png',
        title: 'TRENDING NOW',
        subtitle: 'Street style essentials for the week.',
        cta: 'View Collection',
        link: '/shop?category=trending',
        tag: 'Trending',
    },
    {
        id: 5,
        image: '/slider/slide5_v2.png',
        title: 'THE OVERSIZED DROP',
        subtitle: 'Comfort meets statement silhouettes.',
        cta: 'Shop Oversized',
        link: '/collections',
        tag: 'Oversized',
    },
];

const HeroSlider: React.FC = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const nextSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, []);

    const prevSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    }, []);

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'ArrowRight') {
            nextSlide();
        }
        if (event.key === 'ArrowLeft') {
            prevSlide();
        }
        if (event.key === ' ') {
            event.preventDefault();
            setIsPaused((prev) => !prev);
        }
    };

    // Auto-play
    useEffect(() => {
        if (!isPaused) {
            const interval = setInterval(nextSlide, 5000); // 5 seconds
            return () => clearInterval(interval);
        }
    }, [isPaused, nextSlide]);

    return (
        <div
            className={styles.sliderContainer}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onFocusCapture={() => setIsPaused(true)}
            onBlurCapture={() => setIsPaused(false)}
            onKeyDown={handleKeyDown}
            role="region"
            aria-roledescription="carousel"
            aria-label="Featured promotions"
            tabIndex={0}
        >
            <div className={styles.slider}>
                {slides.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`${styles.slide} ${index === currentSlide ? styles.active : ''}`}
                        aria-hidden={index !== currentSlide}
                    >
                        <Image
                            src={slide.image}
                            alt={slide.title}
                            fill
                            priority={index === 0}
                            className={styles.slideImage}
                        />
                        <div className={styles.overlay} />
                        <div className={styles.content}>
                            <div className={styles.contentInner}>
                                <span className={styles.kicker}>{slide.tag}</span>
                                <h2 className={styles.title}>{slide.title}</h2>
                                <p className={styles.subtitle}>{slide.subtitle}</p>
                                <div className={styles.ctaRow}>
                                    <Link className={styles.ctaLink} href={slide.link}>
                                        {slide.cta}
                                        <ArrowRight size={16} className={styles.ctaIcon} />
                                    </Link>
                                    <Link className={styles.ctaSecondary} href="/shop">
                                        Browse All
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Arrows */}
            <button
                className={`${styles.nav} ${styles.navPrev}`}
                onClick={prevSlide}
                aria-label="Previous slide"
            >
                <ChevronLeft size={24} />
            </button>
            <button
                className={`${styles.nav} ${styles.navNext}`}
                onClick={nextSlide}
                aria-label="Next slide"
            >
                <ChevronRight size={24} />
            </button>


            {/* Indicator Dots */}
            <div className={styles.indicators}>
                {slides.map((_, index) => (
                    <button
                        key={index}
                        className={`${styles.dot} ${index === currentSlide ? styles.dotActive : ''}`}
                        onClick={() => goToSlide(index)}
                        aria-label={`Go to slide ${index + 1}`}
                        aria-current={index === currentSlide}
                    />
                ))}
            </div>

            <div className={styles.progressWrap} aria-hidden>
                <div
                    key={currentSlide}
                    className={styles.progressBar}
                    style={{ animationPlayState: isPaused ? 'paused' : 'running' }}
                />
            </div>

            <div className={styles.slideCounter} aria-hidden>
                <span>{String(currentSlide + 1).padStart(2, '0')}</span>
                <span className={styles.counterDivider}></span>
                <span>{String(slides.length).padStart(2, '0')}</span>
            </div>
        </div>
    );
};

export default HeroSlider;
