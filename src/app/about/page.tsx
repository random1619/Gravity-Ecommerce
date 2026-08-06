import styles from './page.module.css'
import Newsletter from '@/components/ui/Newsletter'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import SplitTextReveal from '@/components/motion/SplitTextReveal'
import ScrollReveal from '@/components/motion/ScrollReveal'
import StaggerGrid from '@/components/motion/StaggerGrid'
import CountUp from '@/components/motion/CountUp'
import { Sprout, Sparkles, Handshake, Sun } from 'lucide-react'

export const metadata = {
  title: 'About Us - GRAVITY',
  description: 'Learn about GRAVITY, our mission, values, and commitment to exceptional fashion and customer experience.'
}

export default function AboutPage() {
  return (
    <div className={styles.aboutPage}>
      <Breadcrumbs />

      <div className={styles.hero}>
        <h1><SplitTextReveal text="About GRAVITY" /></h1>
        <ScrollReveal direction="up" delay={150}>
          <p className={styles.tagline}>
            Redefining fashion with style, sustainability, and inclusivity
          </p>
        </ScrollReveal>
      </div>

      <div className={styles.content}>
        <ScrollReveal direction="up" delay={100}>
          <section className={styles.section}>
            <h2><SplitTextReveal text="Our Story" /></h2>
            <p>
              Founded in 2024, GRAVITY emerged from a simple belief: fashion should be accessible,
              sustainable, and empowering for everyone. What started as a small collection of
              carefully curated pieces has grown into a global community of style enthusiasts
              who believe in quality over quantity.
            </p>
            <p>
              {"We're more than just an e-commerce platform. We're a movement toward conscious"}
              {" consumption, ethical production, and timeless style. Every piece in our collection"}
              {" tells a story of craftsmanship, sustainability, and the people who bring it to life."}
            </p>
          </section>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={150}>
          <section className={styles.section}>
            <h2><SplitTextReveal text="Our Mission" /></h2>
            <StaggerGrid className={styles.missionGrid}>
              <div className={styles.missionCard}>
                <div className={styles.icon}><Sprout size={28} strokeWidth={1.5} /></div>
                <h3>Sustainability First</h3>
                <p>
                  {"We're committed to reducing our environmental impact through sustainable"}
                  {" materials, ethical manufacturing, and carbon-neutral shipping."}
                </p>
              </div>

              <div className={styles.missionCard}>
                <div className={styles.icon}><Sparkles size={28} strokeWidth={1.5} /></div>
                <h3>Quality Craftsmanship</h3>
                <p>
                  Each product is carefully selected and tested to ensure it meets our high
                  standards for quality, durability, and design excellence.
                </p>
              </div>

              <div className={styles.missionCard}>
                <div className={styles.icon}><Handshake size={28} strokeWidth={1.5} /></div>
                <h3>Community Driven</h3>
                <p>
                  We listen to our community, collaborate with creators, and build products
                  based on real feedback from real people.
                </p>
              </div>

              <div className={styles.missionCard}>
                <div className={styles.icon}><Sun size={28} strokeWidth={1.5} /></div>
                <h3>Inclusive Fashion</h3>
                <p>
                  Fashion is for everyone. We offer extended sizing, diverse representation,
                  and styles that celebrate all bodies and identities.
                </p>
              </div>
            </StaggerGrid>
          </section>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={100}>
          <section className={styles.section}>
            <h2><SplitTextReveal text="Our Values" /></h2>
            <StaggerGrid className={styles.valuesList}>
              <div className={styles.value}>
                <h3>Transparency</h3>
                <p>
                  We believe in honest communication about our products, pricing, and practices.
                  No hidden fees, no misleading claims, just straightforward information.
                </p>
              </div>

              <div className={styles.value}>
                <h3>Innovation</h3>
                <p>
                  {"We're constantly evolving, experimenting with new materials, technologies,"}
                  {" and designs to bring you the best possible products."}
                </p>
              </div>

              <div className={styles.value}>
                <h3>Responsibility</h3>
                <p>
                  From fair labor practices to environmental stewardship, we take responsibility
                  for our impact on people and the planet.
                </p>
              </div>
            </StaggerGrid>
          </section>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={150}>
          <section className={styles.section}>
            <h2><SplitTextReveal text="By The Numbers" /></h2>
            <StaggerGrid className={styles.stats}>
              <div className={styles.stat}>
                <div className={styles.statNumber}><CountUp value={500} suffix="K+" duration={1600} /></div>
                <div className={styles.statLabel}>Happy Customers</div>
              </div>

              <div className={styles.stat}>
                <div className={styles.statNumber}><CountUp value={50} suffix="+" duration={1400} /></div>
                <div className={styles.statLabel}>Countries Served</div>
              </div>

              <div className={styles.stat}>
                <div className={styles.statNumber}><CountUp value={95} suffix="%" duration={1500} /></div>
                <div className={styles.statLabel}>Customer Satisfaction</div>
              </div>

              <div className={styles.stat}>
                <div className={styles.statNumber}><CountUp value={100} suffix="%" duration={1600} /></div>
                <div className={styles.statLabel}>Carbon Neutral</div>
              </div>
            </StaggerGrid>
          </section>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={100}>
          <section className={styles.section}>
            <h2><SplitTextReveal text="Join Our Journey" /></h2>
            <p>
              {"We're building something special, and we'd love for you to be part of it."}
              {" Whether you're here to shop, inspire, or connect, you're welcome in the GRAVITY community."}
            </p>
            <p>
              {"Follow us on social media, share your style with #GRAVITYStyle, and let's"}
              {" redefine fashion together."}
            </p>
          </section>
        </ScrollReveal>
      </div>

      <Newsletter />
    </div>
  )
}
