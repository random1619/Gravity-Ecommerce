import styles from './page.module.css';

export default function ProductLoading() {
  return (
    <div className={`container ${styles.productPage}`}>
      <div className={styles.productLayout} aria-busy="true" aria-label="Loading product">
        <div className={styles.gallery} aria-hidden="true">
          <div className={`${styles.mainImage} skeleton`} />
        </div>
        <div className={styles.details} aria-hidden="true">
          <div className="skeleton" style={{ height: 20, width: '30%', borderRadius: 4, marginBottom: 12 }} />
          <div className="skeleton" style={{ height: 36, width: '70%', borderRadius: 4, marginBottom: 16 }} />
          <div className="skeleton" style={{ height: 24, width: '25%', borderRadius: 4, marginBottom: 24 }} />
          <div className="skeleton" style={{ height: 90, width: '100%', borderRadius: 4, marginBottom: 24 }} />
          <div className="skeleton" style={{ height: 48, width: '100%', borderRadius: 8 }} />
        </div>
      </div>
    </div>
  );
}
