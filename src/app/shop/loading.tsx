import ProductSkeleton from '@/components/ui/ProductSkeleton';
import styles from './page.module.css';

export default function ShopLoading() {
  return (
    <div className={`container ${styles.shopPage}`}>
      <div className={styles.shopLayout}>
        <aside className={styles.sidebar} aria-hidden="true" />
        <div className={styles.productGrid} aria-busy="true" aria-label="Loading products">
          {Array.from({ length: 9 }, (_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
