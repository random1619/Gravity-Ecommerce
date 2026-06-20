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
                    <div key={groupIdx} className={styles.marqueeGroup}>
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
