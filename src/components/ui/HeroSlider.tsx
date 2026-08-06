'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './HeroSlider.module.css';
import { ChevronLeft, ChevronRight, ArrowRight, Pause, Play } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion, usePresence } from 'framer-motion';

const AUTOPLAY_MS = 6000;

const slides = [
    {
        id: 1,
        image: '/slider/slide1_v2.png',
        title: 'New arrivals,',
        accent: 'quietly loud.',
        subtitle: 'Fresh styles for campus life.',
        cta: 'Shop Now',
        link: '/shop?category=new',
        tag: 'Just Dropped',
    },
    {
        id: 2,
        image: '/slider/slide2_v2.png',
        title: 'Under ₹999,',
        accent: 'no compromise.',
        subtitle: 'Budget fits with premium energy.',
        cta: 'Explore Deals',
        link: '/shop?maxPrice=999',
        tag: 'Best Value',
    },
    {
        id: 3,
        image: '/slider/slide3_v2.png',
        title: 'Students take',
        accent: '20% off.',
        subtitle: 'Verify once, save on every drop.',
        cta: 'Verify Now',
        link: '/discount',
        tag: 'Exclusive',
    },
];

// Copy choreography — staggered rise on enter, quick upward lift on exit,
// so text leaves *with* the curtain instead of being cut by it.
const copyStagger = {
    show: {
        transition: { staggerChildren: 0.09, delayChildren: 0.45 },
    },
    exit: {
        transition: { staggerChildren: 0.045, staggerDirection: -1 },
    },
};

const copyItem = {
    hidden: { opacity: 0, y: 26 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const },
    },
    exit: {
        opacity: 0,
        y: -16,
        transition: { duration: 0.32, ease: [0.4, 0, 1, 1] as const },
    },
};

const titleLineReveal = {
    hidden: { y: '110%' },
    show: {
        y: 0,
        transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
    },
    exit: {
        y: '-110%',
        transition: { duration: 0.4, ease: [0.4, 0, 1, 1] as const },
    },
};

interface SlideContentProps {
    slide: (typeof slides)[number];
    shouldReduceMotion: boolean | null;
}

// Slide copy block. `usePresence` tells us when AnimatePresence is unmounting
// this slide; while exiting we pull it out of the a11y tree and tab order so
// its CTAs aren't reachable or announced while the curtain is wiping it away.
const SlideContent: React.FC<SlideContentProps> = ({ slide, shouldReduceMotion }) => {
    const [isPresent] = usePresence();
    const heading = (
        <>
            <span className={styles.titleLine}>
                <motion.span variants={shouldReduceMotion ? undefined : titleLineReveal}>
                    {slide.title}
                </motion.span>
            </span>
            <span className={`${styles.titleLine} ${styles.titleAccent}`}>
                <motion.span variants={shouldReduceMotion ? undefined : titleLineReveal}>
                    {slide.accent}
                </motion.span>
            </span>
        </>
    );

    return (
        <motion.div
            className={styles.contentInner}
            variants={shouldReduceMotion ? undefined : copyStagger}
            initial="hidden"
            animate="show"
            exit="exit"
            aria-hidden={!isPresent}
            // inert removes links/buttons from tab order + AT while exiting.
            // Cast: React types lag the `inert` attribute.
            {...({ inert: isPresent ? undefined : '' } as Record<string, unknown>)}
        >
            <motion.span
                variants={shouldReduceMotion ? undefined : copyItem}
                className={styles.kicker}
                aria-hidden="true"
            >
                {slide.tag}
            </motion.span>
            {/* Only one slide is mounted as present at a time, so a single h1
                exists in the DOM — the visible slide IS the page's headline. */}
            <h1 className={styles.title}>{heading}</h1>
            <motion.p
                variants={shouldReduceMotion ? undefined : copyItem}
                className={styles.subtitle}
            >
                {slide.subtitle}
            </motion.p>
            <motion.div
                variants={shouldReduceMotion ? undefined : copyItem}
                className={styles.ctaRow}
            >
                <Link className={styles.ctaLink} href={slide.link}>
                    <span className={styles.ctaLabel}>{slide.cta}</span>
                    <ArrowRight size={16} className={styles.ctaIcon} />
                </Link>
                <Link className={styles.ctaSecondary} href="/shop">
                    Browse All
                </Link>
            </motion.div>
        </motion.div>
    );
};

const HeroSlider: React.FC = () => {
    const shouldReduceMotion = useReducedMotion();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [direction, setDirection] = useState(1); // 1 = next, -1 = prev
    const [dragging, setDragging] = useState(false);
    const [inView, setInView] = useState(true);
    const [userPaused, setUserPaused] = useState(false);
    const pointerStart = useRef<number | null>(null);
    const pointerDelta = useRef(0);
    const containerRef = useRef<HTMLDivElement>(null);

    // Pause autoplay when the carousel scrolls out of view — no point animating
    // (and announcing slide changes) for a frame nobody is looking at.
    useEffect(() => {
        const el = containerRef.current;
        if (!el || typeof IntersectionObserver === 'undefined') return;
        const obs = new IntersectionObserver(
            (entries) => setInView(entries[0].isIntersecting),
            { threshold: 0.25 }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    const nextSlide = useCallback(() => {
        setDirection(1);
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, []);

    const prevSlide = useCallback(() => {
        setDirection(-1);
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    }, []);

    const goToSlide = (index: number) => {
        if (index === currentSlide) return;
        setDirection(index > currentSlide ? 1 : -1);
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
            setUserPaused((prev) => !prev);
        }
    };

    // Pointer drag — horizontal swipe/drag scrubs direction, release decides.
    // Skips drags that start on interactive controls (links, buttons).
    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        if (shouldReduceMotion) return;
        if ((e.target as HTMLElement).closest('a, button')) return;
        pointerStart.current = e.clientX;
        pointerDelta.current = 0;
        setDragging(true);
        setIsPaused(true);
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (pointerStart.current === null) return;
        pointerDelta.current = e.clientX - pointerStart.current;
    };

    const endDrag = () => {
        if (pointerStart.current === null) return;
        const delta = pointerDelta.current;
        pointerStart.current = null;
        pointerDelta.current = 0;
        setDragging(false);
        setIsPaused(false);
        if (Math.abs(delta) > 60) {
            if (delta < 0) nextSlide();
            else prevSlide();
        }
    };

    // Auto-play — paused on hover/focus/drag, when scrolled out of view, when the
    // user explicitly pauses, and fully off when reduced motion is requested.
    useEffect(() => {
        if (!isPaused && !userPaused && inView && !shouldReduceMotion) {
            const interval = setInterval(nextSlide, AUTOPLAY_MS);
            return () => clearInterval(interval);
        }
    }, [isPaused, userPaused, inView, shouldReduceMotion, nextSlide]);

    // Editorial curtain reveal — angled clip-path wipe with slow Ken Burns settle.
    // Reduced motion falls back to a plain crossfade (no geometry changes).
    const slideVariants = shouldReduceMotion
        ? {
              enter: { opacity: 0 },
              center: { opacity: 1, transition: { duration: 0.4, ease: 'easeOut' as const } },
              exit: { opacity: 0, transition: { duration: 0.3, ease: 'easeIn' as const } },
          }
        : {
              enter: (dir: number) => ({
                  clipPath: dir > 0
                      ? 'polygon(100% 0%, 100% 0%, 88% 100%, 88% 100%)'
                      : 'polygon(0% 0%, 0% 0%, 12% 100%, 12% 100%)',
                  scale: 1.12,
              }),
              center: {
                  clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
                  scale: 1,
                  transition: {
                      clipPath: { duration: 0.9, ease: [0.76, 0, 0.24, 1] as const },
                      scale: { duration: 6, ease: 'linear' as const },
                  },
              },
              exit: (dir: number) => ({
                  clipPath: dir > 0
                      ? 'polygon(0% 0%, 12% 0%, 0% 100%, 0% 100%)'
                      : 'polygon(88% 0%, 100% 0%, 100% 100%, 88% 100%)',
                  scale: 1.05,
                  transition: {
                      clipPath: { duration: 0.7, ease: [0.76, 0, 0.24, 1] as const },
                      scale: { duration: 0.7, ease: 'easeIn' as const },
                  },
              }),
          };

    const slide = slides[currentSlide];
    // Countdown ring geometry (r = 15.5 → circumference ≈ 97.4)
    const RING_C = 97.4;

    return (
        <div
            ref={containerRef}
            className={`${styles.sliderContainer} ${dragging ? styles.dragging : ''}`}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onFocusCapture={() => setIsPaused(true)}
            onBlurCapture={() => setIsPaused(false)}
            onKeyDown={handleKeyDown}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            role="region"
            aria-roledescription="carousel"
            aria-label="Featured promotions"
            tabIndex={0}
        >
            <div className={styles.slider}>
                <AnimatePresence initial={false} custom={direction} mode="popLayout">
                    <motion.div
                        key={currentSlide}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        className={styles.slide}
                        drag={shouldReduceMotion ? false : 'x'}
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.12}
                        dragMomentum={false}
                        onDragStart={() => {
                            setDragging(true);
                            setIsPaused(true);
                        }}
                        onDragEnd={(_e, info) => {
                            setDragging(false);
                            setIsPaused(false);
                            if (info.offset.x < -70) nextSlide();
                            else if (info.offset.x > 70) prevSlide();
                        }}
                        style={{ touchAction: 'pan-y' }}
                    >
                        <Image
                            src={slide.image}
                            alt={slide.title}
                            fill
                            priority
                            draggable={false}
                            className={styles.slideImage}
                        />
                        <div className={styles.overlay} />
                        <div className={styles.watermark} aria-hidden>
                            {String(currentSlide + 1).padStart(2, '0')}
                        </div>
                        <div className={styles.content}>
                            {/* Exactly one slide is present at a time, so the per-slide
                                h1 is the page's single h1. Exiting slides go inert +
                                aria-hidden (inside SlideContent) so their CTAs leave the
                                tab order and the a11y tree while the curtain plays. */}
                            <SlideContent slide={slide} shouldReduceMotion={shouldReduceMotion} />
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation Arrows */}
            <button
                className={`${styles.nav} ${styles.navPrev}`}
                onClick={prevSlide}
                aria-label="Previous slide"
            >
                <ChevronLeft size={20} className={styles.navIcon} />
            </button>
            <button
                className={`${styles.nav} ${styles.navNext}`}
                onClick={nextSlide}
                aria-label="Next slide"
            >
                <ChevronRight size={20} className={styles.navIcon} />
            </button>

            {/* Visible pause/play — WCAG 2.2.2 requires a way to stop auto-advancing
                content. Hidden-pause-on-hover alone doesn't count for touch/keyboard. */}
            {!shouldReduceMotion && (
                <button
                    type="button"
                    className={styles.pauseToggle}
                    onClick={() => setUserPaused((prev) => !prev)}
                    aria-label={userPaused ? 'Play slide rotation' : 'Pause slide rotation'}
                    aria-pressed={userPaused}
                >
                    {userPaused ? <Play size={14} /> : <Pause size={14} />}
                </button>
            )}

            {/* Chapter markers — numbered editorial indicators with per-chapter fill.
                Accessible name comes from the visible text ("01 Just Dropped"),
                which voice control can then match verbatim. */}
            <div className={styles.indicators}>
                {slides.map((s, index) => (
                    <button
                        key={index}
                        className={`${styles.chapter} ${index === currentSlide ? styles.chapterActive : ''}`}
                        onClick={() => goToSlide(index)}
                        aria-current={index === currentSlide ? 'true' : undefined}
                    >
                        <span className={styles.chapterNum}>{String(index + 1).padStart(2, '0')}</span>
                        <span className={styles.chapterTag}>{s.tag}</span>
                        <span className={styles.chapterLine} aria-hidden>
                            {index === currentSlide && !shouldReduceMotion && (
                                <span
                                    key={`fill-${currentSlide}`}
                                    className={styles.chapterFill}
                                    style={{
                                        animationDuration: `${AUTOPLAY_MS}ms`,
                                        animationPlayState: isPaused || userPaused || !inView ? 'paused' : 'running',
                                    }}
                                />
                            )}
                        </span>
                    </button>
                ))}
            </div>

            {/* Index chip + countdown ring — the autoplay heartbeat */}
            <div className={styles.slideCounter} aria-hidden>
                <svg className={styles.ring} viewBox="0 0 40 40">
                    <circle className={styles.ringTrack} cx="20" cy="20" r="15.5" />
                    {!shouldReduceMotion && (
                        <circle
                            key={`ring-${currentSlide}`}
                            className={styles.ringProgress}
                            cx="20"
                            cy="20"
                            r="15.5"
                            strokeDasharray={RING_C}
                            style={{
                                animationDuration: `${AUTOPLAY_MS}ms`,
                                animationPlayState: isPaused || userPaused || !inView ? 'paused' : 'running',
                            }}
                        />
                    )}
                </svg>
                <span>{String(currentSlide + 1).padStart(2, '0')}</span>
                <span className={styles.counterDivider}></span>
                <span>{String(slides.length).padStart(2, '0')}</span>
            </div>
        </div>
    );
};

export default HeroSlider;
