import styles from './page.module.css'
import Breadcrumbs from '@/components/ui/Breadcrumbs'

export const metadata = {
  title: 'Shipping & Returns - GRAVITY',
  description: 'Learn about our shipping options, delivery times, and hassle-free return policy.'
}

export default function ShippingReturnsPage() {
  return (
    <div className={styles.policyPage}>
      <Breadcrumbs />

      <div className={styles.hero}>
        <h1>Shipping & Returns</h1>
        <p>Fast, reliable shipping and hassle-free returns. We are committed to your satisfaction.</p>
      </div>

      <div className={styles.content}>
        <section className={styles.section}>
          <h2>Shipping Options</h2>

          <div className={styles.shippingOptions}>
            <div className={styles.optionCard}>
              <div className={styles.optionHeader}>
                <h3>Standard Shipping</h3>
                <span className={styles.price}>$5.99</span>
              </div>
              <p>5-7 business days</p>
              <ul>
                <li>Available to all addresses in the US</li>
                <li>Tracking included</li>
                <li>Free on orders over $75</li>
              </ul>
            </div>

            <div className={styles.optionCard}>
              <div className={styles.optionHeader}>
                <h3>Express Shipping</h3>
                <span className={styles.price}>$12.99</span>
              </div>
              <p>2-3 business days</p>
              <ul>
                <li>Expedited delivery</li>
                <li>Priority tracking</li>
                <li>Available for most locations</li>
              </ul>
            </div>

            <div className={styles.optionCard}>
              <div className={styles.optionHeader}>
                <h3>Overnight Shipping</h3>
                <span className={styles.price}>$24.99</span>
              </div>
              <p>1 business day</p>
              <ul>
                <li>Next-day delivery</li>
                <li>Order by 2 PM EST</li>
                <li>Limited to select locations</li>
              </ul>
            </div>

            <div className={styles.optionCard}>
              <div className={styles.optionHeader}>
                <h3>International</h3>
                <span className={styles.price}>Varies</span>
              </div>
              <p>10-14 business days</p>
              <ul>
                <li>Ships to 50+ countries</li>
                <li>Customs fees may apply</li>
                <li>Full tracking available</li>
              </ul>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2>Processing Time</h2>
          <p>
            Orders are typically processed within 1-2 business days. During peak seasons
            (holidays, sales events), processing may take up to 3-4 business days. You will
            receive a shipping confirmation email with tracking information once your order ships.
          </p>
          <div className={styles.infoBox}>
            <strong>Note:</strong> Orders placed after 2 PM EST will be processed the next business day.
            Business days are Monday through Friday, excluding holidays.
          </div>
        </section>

        <section className={styles.section}>
          <h2>Return Policy</h2>
          <p>
            We want you to love every purchase from GRAVITY. If you are not completely satisfied,
            we offer free returns within 30 days of delivery.
          </p>

          <div className={styles.returnSteps}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>1</div>
              <div className={styles.stepContent}>
                <h3>Initiate Return</h3>
                <p>Start your return through your account or contact our support team</p>
              </div>
            </div>

            <div className={styles.step}>
              <div className={styles.stepNumber}>2</div>
              <div className={styles.stepContent}>
                <h3>Pack Your Items</h3>
                <p>Include all original packaging, tags, and accessories</p>
              </div>
            </div>

            <div className={styles.step}>
              <div className={styles.stepNumber}>3</div>
              <div className={styles.stepContent}>
                <h3>Ship It Back</h3>
                <p>Use the prepaid return label we email you</p>
              </div>
            </div>

            <div className={styles.step}>
              <div className={styles.stepNumber}>4</div>
              <div className={styles.stepContent}>
                <h3>Get Your Refund</h3>
                <p>Refunds processed within 5-7 business days of receiving your return</p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2>Return Requirements</h2>
          <div className={styles.requirements}>
            <div className={styles.requirement}>
              <span className={styles.icon}>✓</span>
              <div>
                <h4>Unworn & Unwashed</h4>
                <p>Items must be in original, unused condition</p>
              </div>
            </div>

            <div className={styles.requirement}>
              <span className={styles.icon}>✓</span>
              <div>
                <h4>Tags Attached</h4>
                <p>All original tags and labels must be attached</p>
              </div>
            </div>

            <div className={styles.requirement}>
              <span className={styles.icon}>✓</span>
              <div>
                <h4>Original Packaging</h4>
                <p>Return items in original packaging when possible</p>
              </div>
            </div>

            <div className={styles.requirement}>
              <span className={styles.icon}>✓</span>
              <div>
                <h4>Within 30 Days</h4>
                <p>Returns must be initiated within 30 days of delivery</p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2>Exchanges</h2>
          <p>
            To exchange an item for a different size or color, we recommend returning the original
            item and placing a new order. This ensures you receive your preferred item as quickly
            as possible. If you need assistance, our support team is happy to help coordinate the
            process.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Non-Returnable Items</h2>
          <ul className={styles.list}>
            <li>Final sale items (marked as final sale at checkout)</li>
            <li>Gift cards</li>
            <li>Downloadable products</li>
            <li>Items showing signs of wear or use</li>
            <li>Items without original tags or packaging</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>Damaged or Defective Items</h2>
          <p>
            If you receive a damaged or defective item, please contact us within 7 days of delivery
            with photos of the issue. We will arrange for a replacement or full refund at no cost to you,
            including return shipping.
          </p>
        </section>

        <section className={styles.ctaSection}>
          <h2>Have Questions?</h2>
          <p>Our customer support team is here to help with any shipping or return questions.</p>
          <div className={styles.ctaButtons}>
            <a href="/contact" className={styles.primaryBtn}>Contact Support</a>
            <a href="/faq" className={styles.secondaryBtn}>View FAQs</a>
          </div>
        </section>
      </div>
    </div>
  )
}
