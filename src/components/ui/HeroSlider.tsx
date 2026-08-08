'use client';

import React, {
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
    motion,
    AnimatePresence,
    useReducedMotion,
} from 'framer-motion';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import styles from './HeroSlider.module.css';

/* ── Slide data ─────────────────────────────────────────────────── */
interface Slide {
    id: string;
    image: string;
    kicker: string;
    title: string;
    accent: string;
    subtitle: string;
    cta: string;
    link: string;
}

const SLIDES: Slide[] = [
    {
        id: 'new-arrivals',
        image: '/slider/slide1_v2.png',
        kicker: 'Drop 04 · Winter ’26',
        title: 'New arrivals,',
        accent: 'quietly loud.',
        subtitle: 'Heavyweight fabrics, garment-dyed, built to outlast the semester.',
        cta: 'Shop the drop',
        link: '/shop',
    },
    {
        id: 'under-999',
        image: '/slider/slide2_v2.png',
        kicker: 'The value edit',
        title: 'Under ₹999,',
        accent: 'no compromise.',
        subtitle: 'Everyday staples engineered for rotation, priced for a student budget.',
        cta: 'Shop under ₹999',
        link: '/shop?filter=under-999',
    },
    {
        id: 'student-discount',
        image: '/slider/slide3_v2.png',
        kicker: 'Student programme',
        title: 'Students take',
        accent: '20% off.',
        subtitle: 'Verify once with your institution email and save on every order.',
        cta: 'Get verified',
        link: '/discount',
    },
];

const COUNT = SLIDES.length;
const AUTOPLAY_MS = 6500;

/* Peek offsets for the cards stacked behind the front one. */
const STACK = [
    { scale: 0.94, y: 18, opacity: 0.9 },
    { scale: 0.88, y: 34, opacity: 0.6 },
];

/* Springs — stiffness/damping tuned to feel physical, not bouncy. */
const springSnappy = { type: 'spring', stiffness: 380, damping: 30, mass: 0.8 } as const;
const springReturn = { type: 'spring', stiffness: 320, damping: 28, mass: 0.9 } as const;

/* Entrance — one idea, done once. The card lifts 12px and settles; the copy
   fades up with it. No staggered masks, no sweep, no pulse: restraint reads
   as confidence. Soft tween, not a spring, so it doesn't overshoot. */
const enterEase = [0.22, 1, 0.36, 1] as const;
const cardEnter = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.4, ease: enterEase } },
};
const copyEnter = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: enterEase, delay: 0.08 } },
};

/* ════════════════════════════════════════════════════════════════ */
const HeroSlider: React.FC = () => {
    const shouldReduceMotion = useReducedMotion();
    const [hasMounted, setHasMounted] = useState(false);
    useEffect(() => setHasMounted(true), []);
    /* useReducedMotion() is null on the server — gate motion until mounted so
       SSR and the first client render are identical. */
    const motionOn = hasMounted && !shouldReduceMotion;

    const [index, setIndex] = useState(0);
    const [paused, setPaused] = useState(false);
    const [inView, setInView] = useState(true);

    const rootRef = useRef<HTMLElement | null>(null);
    const progressRef = useRef(0);
    const rafRef = useRef<number | null>(null);
    const lastTsRef = useRef(0);
    const trackFillRef = useRef<HTMLSpanElement | null>(null);


    const goTo = useCallback((next: number) => {
        setIndex((prev) => {
            const n = ((next % COUNT) + COUNT) % COUNT;
            if (n !== prev) progressRef.current = 0;
            return n;
        });
    }, []);

    /* ── Autoplay: rAF loop so the single track fills in real time ── */
    const autoplayActive = motionOn && !paused && inView;

    useEffect(() => {
        if (!autoplayActive) {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
            return;
        }
        lastTsRef.current = 0;
        const tick = (ts: number) => {
            if (!lastTsRef.current) lastTsRef.current = ts;
            const dt = ts - lastTsRef.current;
            lastTsRef.current = ts;
            progressRef.current += dt / AUTOPLAY_MS;
            if (trackFillRef.current) {
                trackFillRef.current.style.transform = `scaleX(${Math.min(progressRef.current, 1)})`;
            }
            if (progressRef.current >= 1) {
                progressRef.current = 0;
                setIndex((i) => (i + 1) % COUNT);
                return; // effect re-runs when index changes
            }
            rafRef.current = requestAnimationFrame(tick);
        };
        rafRef.current = requestAnimationFrame(tick);
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
        };
    }, [autoplayActive, index]);

    /* Pause when scrolled out of view. */
    useEffect(() => {
        const el = rootRef.current;
        if (!el || typeof IntersectionObserver === 'undefined') return;
        const io = new IntersectionObserver(
            ([entry]) => setInView(entry.isIntersecting),
            { threshold: 0.3 }
        );
        io.observe(el);
        return () => io.disconnect();
    }, []);

    /* Keyboard actions never animate — move instantly (emil-design-eng). */
    const handleKey = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === 'ArrowRight') { e.preventDefault(); goTo(index + 1); }
            else if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(index - 1); }
        },
        [goTo, index]
    );

    const front = SLIDES[index];
    const behind1 = SLIDES[(index + 1) % COUNT];
    const behind2 = SLIDES[(index + 2) % COUNT];

    return (
        <section
            ref={rootRef}
            className={styles.deck}
            aria-roledescription="carousel"
            aria-label="Featured drops"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
        >
            {/* ── Card stack ── */}
            <div
                className={styles.stack}
                role="group"
                tabIndex={0}
                onKeyDown={handleKey}
                aria-label={`Slide ${index + 1} of ${COUNT}: ${front.title} ${front.accent}`}
            >
                {/* back card */}
                <div
                    className={styles.cardGhost}
                    style={{ transform: `translateY(${STACK[1].y}px) scale(${STACK[1].scale})`, opacity: STACK[1].opacity }}
                    aria-hidden
                >
                    <CardFace slide={behind2} dim />
                </div>

                {/* middle card — sits just behind the front, static depth */}
                <motion.div
                    className={styles.cardGhost}
                    style={{ scale: STACK[0].scale }}
                    initial={false}
                    animate={{ y: STACK[0].y, opacity: STACK[0].opacity }}
                    transition={springReturn}
                    aria-hidden
                >
                    <CardFace slide={behind1} dim />
                </motion.div>

                {/* front card — simple crossfade, no movement */}
                <AnimatePresence mode="popLayout">
                    <motion.div
                        key={front.id}
                        className={styles.cardFront}
                        variants={motionOn ? cardEnter : undefined}
                        initial={motionOn ? 'hidden' : false}
                        animate="show"
                        exit={{ opacity: 0, transition: { duration: 0.28, ease: 'easeOut' } }}
                    >
                        <CardFace slide={front} motionOn={motionOn} />
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* ── Controls: dots · one progress track · arrows ── */}
            <div className={styles.controls}>
                <div className={styles.dots} role="tablist" aria-label="Slides">
                    {SLIDES.map((s, i) => (
                        <button
                            key={s.id}
                            role="tab"
                            aria-selected={i === index}
                            aria-label={`Slide ${i + 1}: ${s.kicker}`}
                            className={`${styles.dot} ${i === index ? styles.dotActive : ''}`}
                            onClick={() => goTo(i)}
                        />
                    ))}
                </div>

                {/* The single autoplay indicator — fills, freezes when paused. */}
                <div
                    className={`${styles.track} ${paused && motionOn ? styles.trackPaused : ''}`}
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.round(progressRef.current * 100)}
                    aria-label="Autoplay progress"
                >
                    <span ref={trackFillRef} className={styles.trackFill} />
                </div>

                <div className={styles.arrows}>
                    <button
                        className={styles.arrow}
                        onClick={() => goTo(index - 1)}
                        aria-label="Previous slide"
                    >
                        <ArrowRight size={16} strokeWidth={2} style={{ transform: 'scaleX(-1)' }} />
                    </button>
                    <button
                        className={styles.arrow}
                        onClick={() => goTo(index + 1)}
                        aria-label="Next slide"
                    >
                        <ArrowRight size={16} strokeWidth={2} />
                    </button>
                </div>
            </div>
        </section>
    );
};

/* ── Card face: image + copy travel as one physical object ───────
   Front card (motionOn) gets parallax image, slow-settle zoom, a sheen
   sweep, and staggered masked copy. Ghost cards stay static + dim. */
interface CardFaceProps {
    slide: Slide;
    dim?: boolean;
    motionOn?: boolean;
}

const CardFace: React.FC<CardFaceProps> = ({ slide, dim, motionOn = false }) => {
    const image = (
        <Image
            src={slide.image}
            alt=""
            fill
            priority={!dim}
            sizes="(max-width: 768px) 92vw, 1080px"
            className={styles.faceImg}
            draggable={false}
        />
    );

    return (
        <div className={`${styles.face} ${dim ? styles.faceDim : ''}`}>
            <div className={styles.faceMedia}>
                {image}
                <div className={styles.faceScrim} aria-hidden />
            </div>

            {dim ? (
                <div className={styles.faceCopy}>
                    <span className={styles.kicker}>{slide.kicker}</span>
                    <h2 className={styles.title}>
                        {slide.title}{' '}
                        <span className={styles.titleAccent}>{slide.accent}</span>
                    </h2>
                    <p className={styles.subtitle}>{slide.subtitle}</p>
                </div>
            ) : motionOn ? (
                <motion.div
                    className={styles.faceCopy}
                    variants={copyEnter}
                    initial="hidden"
                    animate="show"
                >
                    <span className={styles.kicker}>{slide.kicker}</span>
                    <h2 className={styles.title}>
                        {slide.title}{' '}
                        <span className={styles.titleAccent}>{slide.accent}</span>
                    </h2>
                    <p className={styles.subtitle}>{slide.subtitle}</p>
                    <div>
                        <Link href={slide.link} className={styles.cta}>
                            <span className={styles.ctaLabel}>{slide.cta}</span>
                            <ArrowUpRight size={15} strokeWidth={2.2} className={styles.ctaIcon} />
                        </Link>
                    </div>
                </motion.div>
            ) : (
                <div className={styles.faceCopy}>
                    <span className={styles.kicker}>{slide.kicker}</span>
                    <h2 className={styles.title}>
                        {slide.title}{' '}
                        <span className={styles.titleAccent}>{slide.accent}</span>
                    </h2>
                    <p className={styles.subtitle}>{slide.subtitle}</p>
                    <Link href={slide.link} className={styles.cta}>
                        {slide.cta}
                        <ArrowUpRight size={15} strokeWidth={2.2} className={styles.ctaIcon} />
                    </Link>
                </div>
            )}
        </div>
    );
};

export default HeroSlider;
