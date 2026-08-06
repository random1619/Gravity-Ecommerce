import React from 'react';
import styles from './Marquee.module.css';

interface MarqueeProps {
    texts: string[];
}

const Marquee: React.FC<MarqueeProps> = ({ texts }) => {
    return (
        <div className={styles.marqueeContainer}>
            <div className={styles.marqueeTrack}>
                {[...Array(4)].map((_, groupIdx) => (
                    // Only the first group is exposed to AT; the rest are visual
                    // duplicates that keep the loop seamless.
                    <div key={groupIdx} className={styles.marqueeGroup} aria-hidden={groupIdx === 0 ? undefined : true}>
                        {texts.map((text, idx) => (
                            <React.Fragment key={idx}>
                                <span className={styles.text}>{text}</span>
                                <span className={styles.separator}>✦</span>
                            </React.Fragment>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Marquee;
