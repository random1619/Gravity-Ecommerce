import Link from 'next/link'
import styles from './page.module.css'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import SplitTextReveal from '@/components/motion/SplitTextReveal'
import ScrollReveal from '@/components/motion/ScrollReveal'
import StaggerGrid from '@/components/motion/StaggerGrid'
import { Check } from 'lucide-react'

export const metadata = {
  title: 'Shipping & Returns - GRAVITY',
  description: 'Learn about our shipping options, delivery times, and hassle-free return policy.'
}

export default function ShippingReturnsPage() {
  return (
    <div className={styles.policyPage}>
      <Breadcrumbs />

      <div className={styles.hero}>
        <h1><SplitTextReveal text="Shipping & Returns" /></h1>
        <ScrollReveal direction="up" delay={150}>
          <p>Fast, reliable shipping and hassle-free returns. We are committed to your satisfaction.</p>
        </ScrollReveal>
      </div>

      <div className={styles.content}>
        <ScrollReveal direction="up" delay={100}>
          <section className={styles.section}>
            <h2><SplitTextReveal text="Shipping Options" /></h2>

            <StaggerGrid className={styles.shippingOptions}>
              <div className={styles.optionCard}>
                <div className={styles.optionHeader}>
                  <h3>Standard Shipping</h3>
                  <span className={styles.price}>₹99</span>
                </div>
                <p>5-7 business days</p>
                <ul>
                  <li>Available across India</li>
                  <li>Tracking included</li>
                  <li>Free on orders over ₹1,499</li>
                </ul>
              </div>

              <div className={styles.optionCard}>
                <div className={styles.optionHeader}>
                  <h3>Express Shipping</h3>
                  <span className={styles.price}>₹249</span>
                </div>
                <p>2-3 business days</p>
                <ul>
                  <li>Expedited delivery</li>
                  <li>Priority tracking</li>
                  <li>Available for most pin codes</li>
                </ul>
              </div>

              <div className={styles.optionCard}>
                <div className={styles.optionHeader}>
                  <h3>Same-Day Delivery</h3>
                  <span className={styles.price}>₹499</span>
                </div>
                <p>Same day</p>
                <ul>
                  <li>Delivered by 9 PM</li>
                  <li>Order by 2 PM IST</li>
                  <li>Metro cities only</li>
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
            </StaggerGrid>
          </section>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={100}>
          <section className={styles.section}>
            <h2><SplitTextReveal text="Processing Time" /></h2>
            <p>
              Orders are typically processed within 1-2 business days. During peak seasons
              (holidays, sales events), processing may take up to 3-4 business days. You will
              receive a shipping confirmation email with tracking information once your order ships.
            </p>
            <div className={styles.infoBox}>
              <strong>Note:</strong> Orders placed after 2 PM IST will be processed the next business day.
              Business days are Monday through Saturday, excluding public holidays.
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={100}>
          <section className={styles.section}>
            <h2><SplitTextReveal text="Return Policy" /></h2>
            <p>
              We want you to love every purchase from GRAVITY. If you are not completely satisfied,
              we offer free returns within 30 days of delivery.
            </p>

            <StaggerGrid className={styles.returnSteps}>
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
            </StaggerGrid>
          </section>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={100}>
          <section className={styles.section}>
            <h2><SplitTextReveal text="Return Requirements" /></h2>
            <StaggerGrid className={styles.requirements}>
              <div className={styles.requirement}>
                <span className={styles.icon}><Check size={18} strokeWidth={2.5} /></span>
                <div>
                  <h4>Unworn & Unwashed</h4>
                  <p>Items must be in original, unused condition</p>
                </div>
              </div>

              <div className={styles.requirement}>
                <span className={styles.icon}><Check size={18} strokeWidth={2.5} /></span>
                <div>
                  <h4>Tags Attached</h4>
                  <p>All original tags and labels must be attached</p>
                </div>
              </div>

              <div className={styles.requirement}>
                <span className={styles.icon}><Check size={18} strokeWidth={2.5} /></span>
                <div>
                  <h4>Original Packaging</h4>
                  <p>Return items in original packaging when possible</p>
                </div>
              </div>

              <div className={styles.requirement}>
                <span className={styles.icon}><Check size={18} strokeWidth={2.5} /></span>
                <div>
                  <h4>Within 30 Days</h4>
                  <p>Returns must be initiated within 30 days of delivery</p>
                </div>
              </div>
            </StaggerGrid>
          </section>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={100}>
          <section className={styles.section}>
            <h2><SplitTextReveal text="Exchanges" /></h2>
            <p>
              To exchange an item for a different size or color, we recommend returning the original
              item and placing a new order. This ensures you receive your preferred item as quickly
              as possible. If you need assistance, our support team is happy to help coordinate the
              process.
            </p>
          </section>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={100}>
          <section className={styles.section}>
            <h2><SplitTextReveal text="Non-Returnable Items" /></h2>
            <ul className={styles.list}>
              <li>Final sale items (marked as final sale at checkout)</li>
              <li>Gift cards</li>
              <li>Downloadable products</li>
              <li>Items showing signs of wear or use</li>
              <li>Items without original tags or packaging</li>
            </ul>
          </section>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={100}>
          <section className={styles.section}>
            <h2><SplitTextReveal text="Damaged or Defective Items" /></h2>
            <p>
              If you receive a damaged or defective item, please contact us within 7 days of delivery
              with photos of the issue. We will arrange for a replacement or full refund at no cost to you,
              including return shipping.
            </p>
          </section>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={120}>
          <section className={styles.ctaSection}>
            <h2><SplitTextReveal text="Have Questions?" /></h2>
            <p>Our customer support team is here to help with any shipping or return questions.</p>
            <div className={styles.ctaButtons}>
              <Link href="/contact" className={styles.primaryBtn}>Contact Support</Link>
              <Link href="/faq" className={styles.secondaryBtn}>View FAQs</Link>
            </div>
          </section>
        </ScrollReveal>
      </div>
    </div>
  )
}
