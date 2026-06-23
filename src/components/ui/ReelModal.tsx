'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styles from './ReelModal.module.css';
import { Heart, MessageCircle, Share2, Play, Pause, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

interface ReelModalProps {
    isOpen: boolean;
    onClose: () => void;
    reelId: number | null;
    imageUrl: string;
    caption: string;
}

const mockCommentsByReel: Record<number, { user: string; text: string }[]> = {
    1: [
        { user: 'drip_king', text: 'This graffiti tee is absolutely insane 🔥. Heavy cotton is the truth!' },
        { user: 'sneha_10', text: 'Does it shrink after washing?' },
        { user: 'gravity_drops', text: '@sneha_10 No! It is pre-shrunk premium heavy combed cotton.' }
    ],
    2: [
        { user: 'rahul_sharma', text: 'Verified student and got 20% off, paid Rs. 799 for the cargos. Absolute steal!' },
        { user: 'kunal.k', text: 'Fit is perfect.' }
    ],
    3: [
        { user: 'priya_21', text: 'Best hoodie ever. So thick!' },
        { user: 'yash_vibe', text: 'Minimalist styling at its peak' }
    ],
    4: [
        { user: 'aisha_p', text: 'Is this collection limited edition?' },
        { user: 'gravity_drops', text: '@aisha_p Yes! Once it sells out, it will not drop again.' }
    ]
};

const ReelModal: React.FC<ReelModalProps> = ({ isOpen, onClose, reelId, imageUrl, caption }) => {
    const [isPlaying, setIsPlaying] = useState(true);
    const [progress, setProgress] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(1420);
    const [comments, setComments] = useState<{ user: string; text: string }[]>([]);
    const [newComment, setNewComment] = useState('');
    const [showPlayOverlay, setShowPlayOverlay] = useState(false);
    
    const progressInterval = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            // Set initial state
            setIsLiked(false);
            setLikeCount(Math.floor(1000 + Math.random() * 2000));
            setComments(reelId ? [...(mockCommentsByReel[reelId] || [])] : []);
            setIsPlaying(true);
            setProgress(0);
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, reelId]);

    // Simulated progress bar playback
    useEffect(() => {
        if (isOpen && isPlaying) {
            progressInterval.current = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) {
                        return 0; // Loop video simulation
                    }
                    return prev + 1;
                });
            }, 100);
        } else {
            if (progressInterval.current) clearInterval(progressInterval.current);
        }
        return () => {
            if (progressInterval.current) clearInterval(progressInterval.current);
        };
    }, [isOpen, isPlaying]);

    // Handle escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
        }
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    if (!isOpen || typeof document === 'undefined') return null;

    const handleTogglePlay = () => {
        setIsPlaying(!isPlaying);
        setShowPlayOverlay(true);
        setTimeout(() => setShowPlayOverlay(false), 600);
    };

    const handleToggleLike = () => {
        if (isLiked) {
            setIsLiked(false);
            setLikeCount(prev => prev - 1);
        } else {
            setIsLiked(true);
            setLikeCount(prev => prev + 1);
        }
    };

    const handleAddComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (newComment.trim() === '') return;
        setComments(prev => [...prev, { user: 'you', text: newComment.trim() }]);
        setNewComment('');
    };

    const modalContent = (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.container} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
                    ✕
                </button>

                {/* Left Side: Video Player simulation */}
                <div className={styles.playerFrame} onClick={handleTogglePlay}>
                    <img src={imageUrl} alt="Reel video frame" className={styles.reelImage} />
                    
                    {/* Immersive player controls & branding */}
                    <div className={styles.playerOverlay}>
                        <div className={styles.topBar}>
                            <span className={styles.liveBadge}>Gravity TV</span>
                            <span style={{ fontSize: '12px', opacity: 0.8 }}>⚡ Simulation Active</span>
                        </div>

                        <div className={styles.bottomInfo}>
                            <div className={styles.brandInfo}>
                                <img src="/favicon.ico" alt="Gravity" className={styles.avatar} />
                                <span className={styles.handle}>gravity.drops</span>
                                <span style={{ fontSize: '10px', background: 'rgba(255,255,255,0.2)', padding: '2px 6px', borderRadius: '4px' }}>Follow</span>
                            </div>
                            <p className={styles.caption}>{caption}</p>
                        </div>
                    </div>

                    {/* Central Play/Pause Overlay animation */}
                    <div className={`${styles.centerPlay} ${showPlayOverlay ? styles.centerPlayActive : ''}`}>
                        {isPlaying ? <Pause size={30} fill="white" /> : <Play size={30} fill="white" />}
                    </div>

                    {/* Bottom Progress Bar */}
                    <div className={styles.progressBarWrap}>
                        <div className={styles.progressBar} style={{ width: `${progress}%` }} />
                    </div>
                </div>

                {/* Right Side: Sidebar stats, details, and interactive comments */}
                <div className={styles.sidebar}>
                    <div>
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.title}>Gravity Reel</h2>
                            <p className={styles.description}>Swipe up for fresh drops. Shop items featured in this video below.</p>
                        </div>

                        {/* Interactive Like/Comments Stats */}
                        <div className={styles.actionStats}>
                            <div className={styles.statItem}>
                                <button 
                                    className={`${styles.iconBtn} ${isLiked ? styles.iconBtnActive : ''}`} 
                                    onClick={handleToggleLike}
                                >
                                    <Heart size={22} fill={isLiked ? 'var(--accent-secondary)' : 'none'} />
                                </button>
                                <span>{likeCount.toLocaleString()} Likes</span>
                            </div>
                            <div className={styles.statItem}>
                                <MessageCircle size={22} />
                                <span>{comments.length} Comments</span>
                            </div>
                            <div className={styles.statItem}>
                                <button className={styles.iconBtn} onClick={() => alert('Link copied to clipboard!')}>
                                    <Share2 size={20} />
                                </button>
                                <span>Share</span>
                            </div>
                        </div>

                        <h4 style={{ fontSize: '14px', textTransform: 'uppercase', marginBottom: '12px' }}>Vibe Comments</h4>
                        {/* Comments scroll area */}
                        <div className={styles.commentsArea}>
                            {comments.map((c, i) => (
                                <div key={i} className={styles.commentItem}>
                                    <div className={styles.commentUser}>{c.user}:</div>
                                    <div className={styles.commentText}>{c.text}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        {/* Add Comment input form */}
                        <form onSubmit={handleAddComment} className={styles.commentForm}>
                            <input 
                                type="text" 
                                placeholder="Add a comment..." 
                                value={newComment} 
                                onChange={(e) => setNewComment(e.target.value)}
                                className={styles.commentInput} 
                            />
                            <button type="submit" className={styles.commentSubmit}>Post</button>
                        </form>

                        {/* Shop link */}
                        <Link href="/shop" className={styles.shopLink} onClick={onClose}>
                            <ShoppingBag size={18} />
                            <span>Shop Featured items</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
};

export default ReelModal;
