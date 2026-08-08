'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { MessageCircle, Repeat2, Heart, BadgeCheck, Pin, ArrowUpRight } from 'lucide-react';
import styles from './XTimeline.module.css';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import ScrollReveal from '@/components/motion/ScrollReveal';

interface Tweet {
  id: number;
  body: string;
  media?: string;
  replies: string;
  reposts: string;
  likes: string;
  time: string;
  pinned?: boolean;
}

const tweets: Tweet[] = [
  { id: 1, body: 'Drop 04 is live. Heavyweight fleece, garment-dyed, campus-priced. First 100 orders get a free tote.', media: '/look1.png', replies: '84', reposts: '412', likes: '1.2k', time: '2h', pinned: true },
  { id: 2, body: 'The Graffiti Tee restock sold out in 40 minutes. Next drop: Friday 6pm. Set your alarms.', replies: '112', reposts: '238', likes: '980', time: '6h' },
  { id: 3, body: 'Unpopular opinion: your denim jacket should outlast your degree.', media: '/look3.png', replies: '156', reposts: '890', likes: '2.1k', time: '1d' },
  { id: 4, body: '350 GSM. Pre-shrunk. Garment-dyed. We do not do fast fashion here.', replies: '93', reposts: '301', likes: '1.7k', time: '2d' },
  { id: 5, body: 'Student discount is 20% now. Verify once, save every order. You are welcome.', media: '/look2.png', replies: '210', reposts: '1.1k', likes: '3.4k', time: '3d' },
  { id: 6, body: 'Accessories restock: beanies, chains, totes. Complete the fit.', replies: '45', reposts: '120', likes: '760', time: '4d' },
];

function TweetCard({ tweet }: { tweet: Tweet }) {
  const [liked, setLiked] = useState(false);
  const [reposted, setReposted] = useState(false);
  const [likeKey, setLikeKey] = useState(0);

  const toggleLike = () => {
    setLiked((v) => !v);
    if (!liked) setLikeKey((k) => k + 1);
  };

  return (
    <article className={`${styles.tweet} ${tweet.pinned ? styles.pinned : ''}`}>
      <div className={styles.tweetHead}>
        <span className={styles.avatar}>G.</span>
        <div className={styles.who}>
          <span className={styles.name}>
            GRAVITY <BadgeCheck size={15} color="var(--accent-indigo)" />
          </span>
          <span className={styles.handle}>@gravitystyle</span>
        </div>
        {tweet.pinned && (
          <span className={styles.pinBadge}><Pin size={12} /> Pinned</span>
        )}
      </div>

      <p className={styles.tweetBody}>{tweet.body}</p>

      {tweet.media && (
        <div className={styles.tweetMedia}>
          <Image src={tweet.media} alt="" fill sizes="(max-width: 640px) 100vw, 600px" />
        </div>
      )}

      <div className={styles.tweetFoot}>
        <button type="button" className={`${styles.act} ${styles.actReply}`} aria-label="Reply">
          <MessageCircle size={15} /> {tweet.replies}
        </button>
        <button
          type="button"
          className={`${styles.act} ${styles.actRepost} ${reposted ? styles.on : ''}`}
          onClick={() => setReposted((v) => !v)}
          aria-pressed={reposted}
          aria-label="Repost"
        >
          <Repeat2 size={15} /> {tweet.reposts}
        </button>
        <button
          type="button"
          className={`${styles.act} ${styles.actLike} ${liked ? styles.on : ''}`}
          onClick={toggleLike}
          aria-pressed={liked}
          aria-label={liked ? 'Unlike' : 'Like'}
        >
          <Heart key={likeKey} size={15} fill={liked ? 'currentColor' : 'none'} /> {tweet.likes}
        </button>
        <span className={styles.time}>{tweet.time}</span>
      </div>
    </article>
  );
}

export default function XPage() {
  return (
    <div className={styles.page}>
      <div className="container">
        <Breadcrumbs />

        <header className={styles.header}>
          <ScrollReveal direction="up" duration={700}>
            <span className={styles.eyebrow}>@gravitystyle</span>
            <h1 className={styles.title}>
              The timeline, <em>unfiltered.</em>
            </h1>
            <p className={styles.subtitle}>
              Drop alerts, restock warnings, and the occasional hot take. The fastest
              place to hear about it first.
            </p>
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--cta btn--lg"
            >
              Follow on X
              <ArrowUpRight size={18} />
            </a>
          </ScrollReveal>
        </header>

        <div className={styles.timeline}>
          {tweets.map((tweet, i) => (
            <ScrollReveal key={tweet.id} direction="up" delay={i * 60} duration={600}>
              <TweetCard tweet={tweet} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  );
}
