import styles from './page.module.css';

export default function CollectionsLoading() {
  return (
    <div className={`container ${styles.collectionsPage}`} aria-busy="true" aria-label="Loading collections">
      <div className={styles.header}>
        <div className={styles.eyebrowRow}>
          <span className={styles.rule} aria-hidden="true" />
          <span className={styles.issue}>Nº 01 — The Index</span>
          <span className={styles.rule} aria-hidden="true" />
        </div>
        <div className={`${styles.titleSkeleton} skeleton`} aria-hidden="true" />
        <div className={`${styles.subtitleSkeleton} skeleton`} aria-hidden="true" />
      </div>
      <div className={styles.grid}>
        {Array.from({ length: 4 }, (_, i) => (
          <div
            key={i}
            className={`${styles.card} ${i % 4 === 1 || i % 4 === 2 ? styles.cardTall : ''} skeleton`}
            aria-hidden="true"
          />
        ))}
      </div>
    </div>
  );
}
