import styles from './page.module.css';

export default function CollectionsLoading() {
  return (
    <div className={`container ${styles.collectionsPage}`}>
      <div className={styles.grid} aria-busy="true" aria-label="Loading collections">
        {Array.from({ length: 4 }, (_, i) => (
          <div
            key={i}
            className={`${styles.card} skeleton`}
            style={{ minHeight: 280 }}
            aria-hidden="true"
          />
        ))}
      </div>
    </div>
  );
}
