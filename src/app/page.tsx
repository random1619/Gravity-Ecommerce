'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import styles from './page.module.scss';
import HeroSlider from '@/components/ui/HeroSlider';
import ProductCard from '@/components/ui/ProductCard';
import ProductSkeleton from '@/components/ui/ProductSkeleton';
import Button from '@/components/ui/Button';
import QuickView from '@/components/ui/QuickView';
import LoginModal from '@/components/ui/LoginModal';
import Marquee from '@/components/ui/Marquee';
import ReelModal from '@/components/ui/ReelModal';
import ScrollReveal from '@/components/motion/ScrollReveal';
import SplitTextReveal from '@/components/motion/SplitTextReveal';
import Parallax from '@/components/motion/Parallax';
import CountUp from '@/components/motion/CountUp';
import StaggerGrid from '@/components/motion/StaggerGrid';
import Tilt from '@/components/motion/Tilt';
import {
    ArrowRight,
    ChevronLeft,
    ChevronRight,
    Truck,
    RotateCcw,
    ShieldCheck,
    BadgePercent,
    Star,
    Eye,
    Play,
} from 'lucide-react';
import { collections } from '@/lib/data';
import type { Product } from '@/lib/data';

/**
 * Kowalski spring presets — every interactive surface on the page moves
 * through physics, never fixed durations, so motion stays interruptible.
 */
const spring = {
    snappy: { type: 'spring', stiffness: 500, damping: 35, mass: 0.6 },
    bouncy: { type: 'spring', stiffness: 600, damping: 20, mass: 0.5 },
} as const;

const reelsData = [
    { id: 1, image: '/reel-1.png', product: 'Oversized Graffiti Tee', price: '₹699', views: '14.2k', duration: '0:32', caption: 'Rocking the Oversized Graffiti Tee in size L. Combed cotton feels next level. #streetwear #oversized #gravity' },
    { id: 2, image: '/reel-2.png', product: 'Acid Wash Cargos', price: '₹999', views: '23.1k', duration: '0:45', caption: 'Acid Wash Cargos in action. Utility straps, multiple pockets, tapered fit. Rs. 999 only. #cargopants #drip #campusstyle' },
    { id: 3, image: '/reel-3.png', product: 'Desert Storm Hoodie', price: '₹1299', views: '35.8k', duration: '0:28', caption: 'Winter collection preview. Desert Storm Hoodie in heavyweight 350 GSM fleece. Cozy vibe check. #winterdrop #hoodie' },
    { id: 4, image: '/reel-4.png', product: 'Street Essentials Kit', price: '₹899', views: '42.7k', duration: '0:51', caption: 'Streetwear essentials: Beanie, chain necklace, and Canvas Totebag. Complete the look. #accessories #streetaccessories' }
];

const featuresData = [
    { icon: Truck, title: 'Free shipping', desc: 'On every order over ₹1500, campus-wide.' },
    { icon: RotateCcw, title: '30-day returns', desc: 'Fit not right? Easy swaps, no questions.' },
    { icon: ShieldCheck, title: 'Secure checkout', desc: 'UPI, cards & COD, fully encrypted.' },
    { icon: BadgePercent, title: 'Student discount', desc: 'Verified students take an extra 20% off.' },
];

const testimonialsData = [
    { quote: 'The 350 GSM hoodie is genuinely the heaviest I own. Survived two winters and still boxy.', name: 'Aditya R.', campus: 'IIT Delhi', rating: 5 },
    { quote: 'Ordered Tuesday, wearing it Thursday. The oversized tee fits exactly like the size guide says.', name: 'Sneha M.', campus: 'Christ University', rating: 5 },
    { quote: 'Finally a brand that prices for students without feeling cheap. The cargos are my daily driver.', name: 'Karan P.', campus: 'Mumbai University', rating: 4 },
];

const socialData = [
    { image: '/reel-1.png', likes: '4.2k' },
    { image: '/reel-2.png', likes: '3.1k' },
    { image: '/reel-3.png', likes: '5.8k' },
    { image: '/reel-4.png', likes: '2.7k' },
    { image: '/look1.png', likes: '6.4k' },
];

/** Truncate at a word boundary so aria-labels never cut a word mid-way. */
function truncateWords(text: string, max: number): string {
    if (text.length <= max) return text;
    const sliced = text.slice(0, max);
    const lastSpace = sliced.lastIndexOf(' ');
    return (lastSpace > 0 ? sliced.slice(0, lastSpace) : sliced).trim() + '…';
}

export default function Home() {
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
    const [budgetDrops, setBudgetDrops] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
    const [showLoginModal, setShowLoginModal] = useState(false);
    
    // Reel state
    const [activeReel, setActiveReel] = useState<(typeof reelsData)[number] | null>(null);

    const stepReel = (dir: number) => {
        setActiveReel(prev => {
            if (!prev) return prev;
            const idx = reelsData.findIndex(r => r.id === prev.id);
            const next = (idx + dir + reelsData.length) % reelsData.length;
            return reelsData[next];
        });
    };

    // Collections rail ref for arrow scrolling
    const railRef = React.useRef<HTMLDivElement>(null);
    const scrollRail = (dir: number) => {
        railRef.current?.scrollBy({ left: dir * 320, behavior: 'smooth' });
    };

    useEffect(() => {
        const fetchHomeData = async () => {
            setLoading(true);
            try {
                // Fetch specific segments for homepage
                const [res1, res2] = await Promise.all([
                    fetch('/api/products?maxPrice=2000'), // Featured
                    fetch('/api/products?maxPrice=999'), // Budget
                ]);

                // Guard both the HTTP status and the payload shape — a 500
                // returns an error object, not Product[], and `.slice`/`.map`
                // on that would crash the page.
                const data1: unknown = res1.ok ? await res1.json() : [];
                const data2: unknown = res2.ok ? await res2.json() : [];

                setFeaturedProducts(Array.isArray(data1) ? data1.slice(0, 4) : []);
                setBudgetDrops(Array.isArray(data2) ? data2.slice(0, 4) : []);
            } catch (error) {
                console.error('Home data fetch error:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchHomeData();
    }, []);

    return (
        <main className={styles.home}>
            <QuickView
                isOpen={!!quickViewProduct}
                onClose={() => setQuickViewProduct(null)}
                onLoginRequired={() => setShowLoginModal(true)}
                product={quickViewProduct}
            />
            <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
            
            {/* Reel Modal */}
            <ReelModal
                isOpen={!!activeReel}
                onClose={() => setActiveReel(null)}
                reelId={activeReel?.id ?? null}
                imageUrl={activeReel?.image ?? ''}
                caption={activeReel?.caption ?? ''}
                onNavigate={stepReel}
                position={activeReel ? { index: reelsData.findIndex(r => r.id === activeReel.id) + 1, total: reelsData.length } : null}
            />

            <HeroSlider />

            <Marquee
                texts={[
                    "NEW COLD WEATHER DROPS",
                    "FREE SHIPPING OVER ₹1500",
                    "STUDENTS: 20% OFF · CODE STUDENT20"
                ]}
            />

            <section className={styles.section}>
                <div className="container">
                    <div className={styles.sectionHeader}>
                        <ScrollReveal direction="up" delay={100} duration={800}>
                            <Parallax offset={24}>
                            <div>
                                <span className={styles.eyebrow}>Drop 04 · Winter &rsquo;26</span>
                                <h2 className={styles.sectionTitle}>
                                    <SplitTextReveal text="The newest drops," />{' '}
                                    <em>quietly built.</em>
                                </h2>
                                <p className={styles.sectionSubtitle}>Heavyweight fabrics, garment-dyed, made to outlast the semester.</p>
                            </div>
                            </Parallax>
                        </ScrollReveal>
                        <Link href="/shop" className={styles.viewAll}>Shop all →</Link>
                    </div>
                    <StaggerGrid className={styles.productGrid}>
                        {loading ? (
                            <>
                                <ProductSkeleton />
                                <ProductSkeleton />
                                <ProductSkeleton />
                                <ProductSkeleton />
                            </>
                        ) : (
                            featuredProducts.map(p => (
                                <ProductCard
                                    key={p.id}
                                    {...p}
                                    onQuickView={() => setQuickViewProduct(p)}
                                />
                            ))
                        )}
                    </StaggerGrid>
                </div>
            </section>

            {/* Editorial split — story moment between the product rails */}
            <section className={styles.sectionEditorial}>
                <div className="container">
                    <ScrollReveal direction="up" duration={900}>
                        <div className={styles.editorial}>
                            <Parallax offset={-50} className={styles.editorialImageWrap}>
                                <div className={styles.editorialImage}>
                                    <Image src="/hero-main.png" alt="Heavyweight fleece editorial" fill sizes="(max-width: 768px) 100vw, 50vw" />
                                </div>
                            </Parallax>
                            <div className={styles.editorialBody}>
                                <span className={styles.eyebrow}>The Craft</span>
                                <h2>
                                    <SplitTextReveal text="Built like" />{' '}
                                    <em>outerwear,</em>{' '}
                                    <SplitTextReveal text="priced like campus gear." delay={0.15} />
                                </h2>
                                <p>Every piece starts as 350 GSM combed fleece, garment-dyed and pre-shrunk. No fast-fashion shortcuts, just weight, drape, and a fit that holds its shape.</p>
                                <div className={styles.editorialMeta}>
                                    <div><strong><CountUp value={350} suffix=" GSM" duration={1400} /></strong><span>Heavyweight Fleece</span></div>
                                    <div><strong><CountUp value={100} suffix="%" duration={1400} /></strong><span>Combed Cotton</span></div>
                                    <div><strong><CountUp value={4} prefix="0" duration={1400} /></strong><span>Drops / Year</span></div>
                                </div>
                                <Link href="/sustainability" className={styles.viewAll}>Our process →</Link>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            <section className={styles.discountBanner}>
                <div className="container">
                    <ScrollReveal direction="up" duration={1000}>
                        <div className={styles.bannerCard}>
                            <div className={styles.bannerContent}>
                                <h2>Verified student? <em>Take 20% off.</em></h2>
                                <p>Link your student ID once. The discount applies itself at checkout, every order. Prefer a code? Use <strong>STUDENT20</strong> for 20% off.</p>
                                <Link href="/discount">
                                    <button type="button" className="btn btn--on-dark btn--lg">Verify in 30 seconds</button>
                                </Link>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            <section className={`${styles.section} ${styles.budgetBg}`}>
                <div className="container">
                    <div className={styles.sectionHeader}>
                        <ScrollReveal direction="up" delay={100} duration={800}>
                            <Parallax offset={24}>
                            <div>
                                <h2 className={styles.sectionTitle}>
                                    <SplitTextReveal text="Under ₹999," />{' '}
                                    <em>no compromises.</em>
                                </h2>
                                <p className={styles.sectionSubtitle}>The same fabrics and fits, at student-budget prices.</p>
                            </div>
                            </Parallax>
                        </ScrollReveal>
                        <Link href="/shop?maxPrice=999">
                            <Button variant="outline" size="sm">Explore Deals</Button>
                        </Link>
                    </div>
                    <StaggerGrid className={styles.productGrid}>
                        {loading ? (
                            <>
                                <ProductSkeleton />
                                <ProductSkeleton />
                                <ProductSkeleton />
                                <ProductSkeleton />
                            </>
                        ) : (
                            budgetDrops.map(p => (
                                <ProductCard
                                    key={p.id}
                                    {...p}
                                    onQuickView={() => setQuickViewProduct(p)}
                                />
                            ))
                        )}
                    </StaggerGrid>
                </div>
            </section>

            {/* Mini Reels Section Preview */}
            <section className={styles.sectionReels}>
                <div className="container">
                    <ScrollReveal direction="up" duration={800}>
                        <div className={styles.reelsHeader}>
                            <div>
                                <span className={styles.eyebrow}>On Campus</span>
                                <h2 className={styles.sectionTitle}>
                                    <SplitTextReveal text="Worn by" />{' '}
                                    <em>you.</em>
                                </h2>
                            </div>
                            <p className={styles.reelsSub}>
                                Real fits, straight from campus. Tap a reel to watch the drop in motion.
                            </p>
                        </div>
                    </ScrollReveal>
                    <div className={styles.reelsGrid}>
                        {reelsData.map((reel, i) => (
                            <ScrollReveal key={reel.id} direction="up" delay={i * 90} duration={700}>
                                <Tilt max={7} className={styles.reelTilt}>
                                    <motion.button
                                        type="button"
                                        className={styles.reelCard}
                                        onClick={() => setActiveReel(reel)}
                                        data-cursor-text="PLAY"
                                        aria-label={`Play reel: ${reel.product} - ${truncateWords(reel.caption.replace(/[^\w\s#]/gu, ''), 60)}`}
                                        whileHover={{ y: -6 }}
                                        whileTap={{ scale: 0.965 }}
                                        transition={spring.snappy}
                                    >
                                        <Image src={reel.image} alt={`Gravity Reel - ${reel.product}`} fill sizes="(max-width: 640px) 50vw, 20vw" className={styles.reelImage} />

                                        {/* top chips */}
                                        <span className={styles.reelViews} aria-hidden="true">
                                            <Eye size={11} /> {reel.views}
                                        </span>
                                        <span className={styles.reelDuration} aria-hidden="true">{reel.duration}</span>

                                        {/* bottom info + progress */}
                                        <span className={styles.reelInfo} aria-hidden="true">
                                            <span className={styles.reelProduct}>{reel.product}</span>
                                            <span className={styles.reelPrice}>{reel.price}</span>
                                            <span className={styles.reelProgress}><span style={{ width: `${((i + 1) / reelsData.length) * 100}%` }} /></span>
                                        </span>

                                        {/* hover overlay */}
                                        <span className={styles.reelOverlay} aria-hidden="true">
                                            <span className={styles.reelPlayBtn}><Play size={18} fill="currentColor" /></span>
                                            <span className={styles.reelOverlayLabel}>Play reel</span>
                                        </span>
                                    </motion.button>
                                </Tilt>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* === COLLECTIONS RAIL — horizontal snap-scroll === */}
            <section className={styles.sectionCollections}>
                <div className="container">
                    <div className={styles.sectionHeader}>
                        <ScrollReveal direction="up" delay={100} duration={800}>
                            <div>
                                <h2 className={styles.sectionTitle}>
                                    <SplitTextReveal text="Shop the" />{' '}
                                    <em>collections.</em>
                                </h2>
                            </div>
                        </ScrollReveal>
                        <div className={styles.railControls}>
                            <motion.button type="button" onClick={() => scrollRail(-1)} aria-label="Scroll collections left" className={styles.railBtn} whileHover={{ y: -2 }} whileTap={{ scale: 0.9 }} transition={spring.bouncy}>
                                <ChevronLeft size={18} />
                            </motion.button>
                            <motion.button type="button" onClick={() => scrollRail(1)} aria-label="Scroll collections right" className={styles.railBtn} whileHover={{ y: -2 }} whileTap={{ scale: 0.9 }} transition={spring.bouncy}>
                                <ChevronRight size={18} />
                            </motion.button>
                        </div>
                    </div>
                </div>
                <div className={styles.rail} ref={railRef}>
                    {collections.map(c => (
                        <Tilt key={c.id} max={5} className={styles.railTilt}>
                            <motion.div whileHover={{ y: -4 }} whileTap={{ scale: 0.975 }} transition={spring.snappy} className={styles.railPress}>
                                <Link href={c.category ? `/shop?category=${encodeURIComponent(c.category)}` : '/collections'} className={styles.railCard}>
                                    <div className={styles.railImageWrap}>
                                        <Image src={c.imageUrl} alt={c.title} fill sizes="(max-width: 640px) 70vw, 300px" className={styles.railImage} />
                                    </div>
                                    <div className={styles.railMeta}>
                                        <h3>{c.title}</h3>
                                        <p>{c.subtitle}</p>
                                        <span className={styles.railCount}>
                                            {c.itemCount} pieces <ArrowRight size={13} />
                                        </span>
                                    </div>
                                </Link>
                            </motion.div>
                        </Tilt>
                    ))}
                </div>
            </section>

            {/* === FEATURE STRIP — trust badges === */}
            <section className={styles.featureStrip}>
                <div className="container">
                    <StaggerGrid className={styles.featureGrid}>
                        {featuresData.map(f => {
                            const Icon = f.icon;
                            return (
                                <div key={f.title} className={styles.featureItem}>
                                    <span className={styles.featureIcon}><Icon size={20} /></span>
                                    <div>
                                        <strong>{f.title}</strong>
                                        <p>{f.desc}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </StaggerGrid>
                </div>
            </section>

            {/* === TESTIMONIALS === */}
            <section className={styles.sectionTestimonials}>
                <div className="container">
                    <ScrollReveal direction="up" duration={800}>
                        <h2 className={styles.sectionTitle}>
                            <SplitTextReveal text="Rated by the" />{' '}
                            <em>people who wear it.</em>
                        </h2>
                    </ScrollReveal>
                    <StaggerGrid className={styles.testimonialGrid}>
                        {testimonialsData.map(t => (
                            <Tilt key={t.name} max={4} className={styles.testimonialTilt}>
                                <motion.figure
                                    className={styles.testimonialCard}
                                    whileHover={{ y: -4 }}
                                    whileTap={{ scale: 0.985 }}
                                    transition={spring.snappy}
                                >
                                    <div className={styles.testimonialStars} role="img" aria-label={`${t.rating} out of 5 stars`}>
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Star key={i} size={14} fill={i < t.rating ? 'currentColor' : 'none'} strokeWidth={i < t.rating ? 0 : 1.5} />
                                        ))}
                                    </div>
                                    <blockquote>“{t.quote}”</blockquote>
                                    <figcaption>
                                        <strong>{t.name}</strong>
                                        <span>{t.campus}</span>
                                    </figcaption>
                                </motion.figure>
                            </Tilt>
                        ))}
                    </StaggerGrid>
                </div>
            </section>

            {/* === SOCIAL RAIL — Instagram-style strip === */}
            <section className={styles.sectionSocial}>
                <div className="container">
                    <ScrollReveal direction="up" duration={800}>
                        <div className={styles.socialHead}>
                            <div>
                                <h2 className={styles.sectionTitle}>
                                    <SplitTextReveal text="Tag us to get" />{' '}
                                    <em>featured.</em>
                                </h2>
                            </div>
                            <Link href="/social" className={styles.viewAll}>@gravity.campus →</Link>
                        </div>
                    </ScrollReveal>
                    <div className={styles.socialRail}>
                        {socialData.map((s, i) => (
                            <motion.div key={i} whileHover={{ y: -4 }} whileTap={{ scale: 0.94 }} transition={spring.bouncy} className={styles.socialPress}>
                                <Link href="/social" className={styles.socialCard}>
                                    <Image src={s.image} alt={`Gravity on campus ${i + 1}`} fill sizes="(max-width: 640px) 40vw, 200px" className={styles.socialImage} />
                                    <span className={styles.socialOverlay}>
                                        <Star size={12} fill="currentColor" strokeWidth={0} /> {s.likes}
                                    </span>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
