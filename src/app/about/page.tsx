import styles from './page.module.css'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import SplitTextReveal from '@/components/motion/SplitTextReveal'
import ScrollReveal from '@/components/motion/ScrollReveal'
import StaggerGrid from '@/components/motion/StaggerGrid'
import SkillMeter from '@/components/motion/SkillMeter'
import CountUp from '@/components/motion/CountUp'
import { ArrowUpRight, Braces, Database, PenTool, BarChart3, Sparkles, Layers } from 'lucide-react'

export const metadata = {
  title: 'The Founder - GRAVITY',
  description:
    'Meet Gagan — the frontend designer and data scientist behind GRAVITY. Interfaces that think, models that feel.'
}

/* The founder's two disciplines, rendered as quiet meters.
   Values are deliberate: a designer first, a scientist always. */
const DISCIPLINES = [
  { key: 'craft', label: 'Craft', note: 'Frontend design', value: 0.92 },
  { key: 'logic', label: 'Logic', note: 'Data science', value: 0.78 }
] as const

const CRAFT_SKILLS = [
  {
    icon: PenTool,
    title: 'Interface Design',
    body: 'Editorial layouts, committed type hierarchies, and surfaces that feel considered — never templated. Design direction is chosen before the first pixel.'
  },
  {
    icon: Braces,
    title: 'Frontend Engineering',
    body: 'React, Next.js, TypeScript, and motion that respects the frame budget. Transform-and-opacity only, springs over tweens, reduced-motion variants that ship.'
  },
  {
    icon: Layers,
    title: 'Design Systems',
    body: 'Token-driven theming, light and dark from one source of truth, components that compose. Coherence bought once, paid forward everywhere.'
  }
] as const

const LOGIC_SKILLS = [
  {
    icon: Database,
    title: 'Data Modeling',
    body: 'From raw events to clean schemas. The shape of the data decides what the product can honestly say.'
  },
  {
    icon: BarChart3,
    title: 'Analytics & Insight',
    body: 'Funnels, cohorts, and the discipline of asking what a metric would look like if the hypothesis were wrong.'
  },
  {
    icon: Sparkles,
    title: 'Machine Learning',
    body: 'Recommendation and ranking that stay quiet until they earn attention. Models evaluated on what users do, not what decks claim.'
  }
] as const

export default function AboutPage() {
  return (
    <div className={styles.aboutPage}>
      <Breadcrumbs />

      {/* ---------- Hero — the signature, not a banner ---------- */}
      <header className={styles.hero}>
        <ScrollReveal direction="up">
          <p className={styles.eyebrow}>The maker behind GRAVITY</p>
        </ScrollReveal>
        <div className={styles.heroRow}>
          <ScrollReveal direction="right" delay={80}>
            <span className={styles.medallion} aria-hidden="true">
              G
            </span>
          </ScrollReveal>
          <h1 className={styles.heroName}>
            <SplitTextReveal text="Gagan" />
          </h1>
        </div>
        <ScrollReveal direction="up" delay={150}>
          <p className={styles.heroRole}>
            Frontend designer
            <span className={styles.roleTimes} aria-hidden="true"> × </span>
            data scientist
          </p>
        </ScrollReveal>
        <ScrollReveal direction="up" delay={220}>
          <blockquote className={styles.creed}>
            “I build interfaces that think, and models that feel.”
          </blockquote>
        </ScrollReveal>
      </header>

      <div className={styles.content}>
        {/* ---------- The story ---------- */}
        <ScrollReveal direction="up" delay={60}>
          <section className={styles.section}>
            <h2><SplitTextReveal text="One person, two disciplines" /></h2>
            <p>
              GRAVITY is designed and engineered by one person working at the seam of two
              crafts. The designer half obsesses over the space between letters and the
              weight of a hover; the scientist half instruments everything and lets the
              numbers argue back. Neither half wins — the negotiation is the product.
            </p>
            <p>
              {"Every screen here started as a question: what would this look like if it were"}
              {" honest? The answer is a store that behaves like a studio — editorial where it"}
              {" speaks, quiet where it works, and measured everywhere."}
            </p>
          </section>
        </ScrollReveal>

        {/* ---------- The two meters ---------- */}
        <ScrollReveal direction="up" delay={80}>
          <section className={styles.section}>
            <h2><SplitTextReveal text="Craft × Logic" /></h2>
            <p className={styles.sectionIntro}>
              Two disciplines, held in tension. The meters are honest — a designer first,
              a scientist always.
            </p>
            <div className={styles.meters}>
              {DISCIPLINES.map((m, i) => (
                <SkillMeter key={m.key} label={m.label} note={m.note} value={m.value} index={i} />
              ))}
            </div>
          </section>
        </ScrollReveal>

        {/* ---------- Craft skills ---------- */}
        <ScrollReveal direction="up" delay={60}>
          <section className={styles.section}>
            <h2><SplitTextReveal text="The craft side" /></h2>
            <StaggerGrid className={styles.skillGrid}>
              {CRAFT_SKILLS.map((s) => (
                <article className={styles.skillCard} key={s.title}>
                  <div className={styles.skillIcon}><s.icon size={26} strokeWidth={1.5} /></div>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </article>
              ))}
            </StaggerGrid>
          </section>
        </ScrollReveal>

        {/* ---------- Logic skills ---------- */}
        <ScrollReveal direction="up" delay={60}>
          <section className={styles.section}>
            <h2><SplitTextReveal text="The logic side" /></h2>
            <StaggerGrid className={styles.skillGrid}>
              {LOGIC_SKILLS.map((s) => (
                <article className={styles.skillCard} key={s.title}>
                  <div className={styles.skillIcon}><s.icon size={26} strokeWidth={1.5} /></div>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </article>
              ))}
            </StaggerGrid>
          </section>
        </ScrollReveal>

        {/* ---------- How the work gets done ---------- */}
        <ScrollReveal direction="up" delay={60}>
          <section className={styles.section}>
            <h2><SplitTextReveal text="How the work gets done" /></h2>
            <div className={styles.principles}>
              <div className={styles.principle}>
                <h3>Direction before pixels</h3>
                <p>
                  A committed aesthetic world is chosen first and defended on every decision.
                  Coherence comes from rejection — most ideas are thrown away.
                </p>
              </div>
              <div className={styles.principle}>
                <h3>Motion is physical</h3>
                <p>
                  {"Springs, not tweens. Gestures track 1:1, velocity is handed off, and"}
                  {" everything is interruptible. If it can't be grabbed mid-flight, it"}
                  {" doesn't ship."}
                </p>
              </div>
              <div className={styles.principle}>
                <h3>Details compound</h3>
                <p>
                  Press feedback under 160ms, popovers anchored to their trigger, no animation
                  on the hundredth daily action. The polish you never notice is the point.
                </p>
              </div>
              <div className={styles.principle}>
                <h3>Measured, then trusted</h3>
                <p>
                  Taste proposes, data disposes. Every design conviction here has survived at
                  least one honest attempt to prove it wrong.
                </p>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* ---------- Numbers ---------- */}
        <ScrollReveal direction="up" delay={60}>
          <section className={styles.section}>
            <h2><SplitTextReveal text="The practice, in numbers" /></h2>
            <StaggerGrid className={styles.stats}>
              <div className={styles.stat}>
                <div className={styles.statNumber}><CountUp value={2} duration={900} /></div>
                <div className={styles.statLabel}>Disciplines, one maker</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statNumber}><CountUp value={60} suffix="fps" duration={1300} /></div>
                <div className={styles.statLabel}>Motion budget, always</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statNumber}><CountUp value={100} suffix="%" duration={1500} /></div>
                <div className={styles.statLabel}>Reduced-motion honored</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statNumber}><CountUp value={0} duration={800} /></div>
                <div className={styles.statLabel}>Templates used</div>
              </div>
            </StaggerGrid>
          </section>
        </ScrollReveal>

        {/* ---------- Contact ---------- */}
        <ScrollReveal direction="up" delay={60}>
          <section className={`${styles.section} ${styles.helloSection}`}>
            <h2><SplitTextReveal text="Say hello" /></h2>
            <p>
              {"Questions about the craft, the models, or the store itself — the inbox is open."}
            </p>
            <a className={styles.hello} href="mailto:hello@gravity.demo">
              hello@gravity.demo
              <ArrowUpRight size={15} className={styles.helloIcon} aria-hidden="true" />
            </a>
          </section>
        </ScrollReveal>
      </div>
    </div>
  )
}
