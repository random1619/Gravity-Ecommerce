import Link from 'next/link';
import styles from './Footer.module.css';

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={`container ${styles.footerContainer}`}>
                <div className={styles.brand}>
                    <h2 className={styles.logo}>GRAVITY.</h2>
                    <p className={styles.tagline}>High fashion. Low pressure. Budget-friendly trends for the next gen.</p>
                    <div className={styles.socials}>
                        <Link href="/social/instagram">Instagram</Link>
                        <Link href="/social/tiktok">TikTok</Link>
                        <Link href="/social/x">X / Twitter</Link>
                    </div>
                </div>

                <div className={styles.linksGrid}>
                    <div className={styles.linkGroup}>
                        <h3>Shop</h3>
                        <Link href="/shop">All Products</Link>
                        <Link href="/collections">Collections</Link>
                        <Link href="/lookbook">Lookbook</Link>
                        <Link href="/rewards">Gravity Rewards</Link>
                        <Link href="/discount">Student Discount</Link>
                    </div>
                    <div className={styles.linkGroup}>
                        <h3>Help</h3>
                        <Link href="/contact">Contact Us</Link>
                        <Link href="/faq">FAQ</Link>
                        <Link href="/shipping-returns">Shipping & Returns</Link>
                        <Link href="/orders">Order Status</Link>
                    </div>
                    <div className={styles.linkGroup}>
                        <h3>Company</h3>
                        <Link href="/about">The Founder</Link>
                        <Link href="/about">Craft & Skills</Link>
                        <Link href="/contact">Get in Touch</Link>
                        <Link href="/sustainability">Sustainability</Link>
                    </div>
                </div>
            </div>
            <div className={styles.bottomBar}>
                <div className="container">
                    <p>&copy; {new Date().getFullYear()} GRAVITY Fashion. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
