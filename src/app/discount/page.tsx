'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import styles from './page.module.css'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import Toast from '@/components/ui/Toast'
import SplitTextReveal from '@/components/motion/SplitTextReveal'
import ScrollReveal from '@/components/motion/ScrollReveal'
import StaggerGrid from '@/components/motion/StaggerGrid'
import CountUp from '@/components/motion/CountUp'
import {
  GraduationCap,
  Percent,
  Zap,
  Truck,
  Gift,
  Mail,
  IdCard,
  Check,
  Copy,
  ArrowRight,
  Loader2,
  Plus,
  BadgeCheck
} from 'lucide-react'

const PROMO_CODE = 'GRV-STU-24X'
const PERKS = [
  {
    icon: Percent,
    title: '20% Off Every Drop',
    body: 'A flat student rate applied at checkout. No minimum spend, no blackout dates, every single release.'
  },
  {
    icon: Zap,
    title: '48h Early Access',
    body: 'Your link goes live two days before the public drop. Campus members never fight the queue.'
  },
  {
    icon: Truck,
    title: 'Free Express Shipping',
    body: 'Priority dispatch on every order above ₹1200, delivered anywhere in the country at no cost.'
  },
  {
    icon: Gift,
    title: 'Birthday Credit Drop',
    body: 'A surprise store credit lands in your account on your birthday. Our treat, every year.'
  }
]

const TIERS = [
  {
    name: 'Verified',
    tagline: 'The moment your ID clears',
    benefits: ['20% off all drops', 'Student-only promo code']
  },
  {
    name: 'Scholar',
    tagline: 'After 3 orders in a semester',
    benefits: ['+ Free express shipping', '48h early access links']
  },
  {
    name: 'Valedictorian',
    tagline: 'Top campus tier, by invite',
    benefits: ['Secret unlisted drops', 'Birthday credit drop']
  }
]

const FAQS = [
  {
    q: 'Who is eligible for the student discount?',
    a: 'Anyone currently enrolled at a recognised college or university. A valid .edu email address or a photo of your current student ID is all we need to confirm your status.'
  },
  {
    q: 'How long does verification take?',
    a: 'In most cases under 30 seconds. Email verification is instant; a manually uploaded ID is typically reviewed within a few minutes during working hours.'
  },
  {
    q: 'Can I stack the discount with other offers?',
    a: 'Your 20% student rate stacks with items already priced under ₹999 and with free-shipping thresholds, but it cannot be combined with other percentage-off promo codes.'
  },
  {
    q: 'When does my student status expire?',
    a: 'Verification stays active for 12 months. We will send a reminder before it lapses so you can re-verify in one tap and keep your benefits rolling.'
  }
]

export default function StudentDiscount() {
  const [method, setMethod] = useState<'email' | 'id'>('email')
  const [email, setEmail] = useState('')
  const [fileName, setFileName] = useState<string | null>(null)
  const [status, setStatus] = useState<'idle' | 'verifying' | 'verified'>('idle')
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name)
    }
  }

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault()
    if (status === 'verifying') return
    setStatus('verifying')
    timerRef.current = setTimeout(() => {
      setStatus('verified')
      setToastMessage('Student status verified. 20% OFF unlocked on every drop.')
    }, 2000)
  }

  const copyCode = (code: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code)
      setToastMessage(`Code "${code}" copied to clipboard.`)
    }
  }

  return (
    <div className={styles.studentPage}>
      {toastMessage && (
        <Toast
          message={toastMessage}
          type="success"
          onClose={() => setToastMessage(null)}
        />
      )}

      <div className={`container ${styles.pageInner}`}>
        <Breadcrumbs />

        {/* ============ HERO ============ */}
        <header className={styles.hero}>
          <ScrollReveal direction="up" delay={50}>
            <span className={styles.eyebrow}>
              <GraduationCap size={14} className={styles.eyebrowIcon} />
              The Campus Program
            </span>
          </ScrollReveal>
          <h1 className={styles.heroTitle}>
            <SplitTextReveal text="Your student ID is the" />{' '}
            <em className={styles.heroItalic}><SplitTextReveal text="dress code." delay={0.18} /></em>
          </h1>
          <ScrollReveal direction="up" delay={150}>
            <p className={styles.heroSub}>
              Verify once and unlock a flat 20% off every drop, early access links, and
              free express shipping. No fees, no renewals to chase, just proof that
              you are still on campus.
            </p>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={250}>
            <div className={styles.heroActions}>
              <a href="#verify" className={styles.btnPrimary}>
                <span>Verify in 30 seconds</span>
                <ArrowRight size={16} />
              </a>
              <Link href="/rewards" className={styles.btnGhost}>
                Explore Gravity Rewards
              </Link>
            </div>
          </ScrollReveal>
        </header>

        {/* ============ MARQUEE ============ */}
        <div className={styles.marquee} aria-hidden="true">
          <div className={styles.marqueeTrack}>
            {[0, 1].map((dup) => (
              <div className={styles.marqueeGroup} key={dup}>
                {[
                  'Flat 20% Off',
                  '48h Early Access',
                  'Free Express Shipping',
                  'Birthday Credit',
                  'Secret Drops',
                  'No Annual Fee'
                ].map((label) => (
                  <span className={styles.marqueeItem} key={label}>
                    {label} <span className={styles.marqueeDot}>•</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* ============ PASS + VERIFICATION ============ */}
        <section className={styles.verifySection} id="verify">
          {/* The Student Pass */}
          <div className={styles.passWrap}>
            <article
              className={`${styles.pass} ${status === 'verified' ? styles.passVerified : ''}`}
            >
              <div className={styles.passTop}>
                <span className={styles.passBrand}>GRAVITY / CAMPUS</span>
                <GraduationCap size={22} className={styles.passMark} />
              </div>

              <div className={styles.passName}>
                <span className={styles.passLabel}>Member</span>
                <span className={styles.passValue}>
                  {status === 'verified' ? (email.split('@')[0] || 'Student') : 'Awaiting'}
                </span>
              </div>

              <div className={styles.passMeta}>
                <div>
                  <span className={styles.passLabel}>Status</span>
                  <span
                    className={`${styles.passValue} ${
                      status === 'verified' ? styles.passValueOk : ''
                    }`}
                  >
                    {status === 'verified' ? 'Active' : 'Pending'}
                  </span>
                </div>
                <div>
                  <span className={styles.passLabel}>Valid Until</span>
                  <span className={styles.passValue}>
                    {status === 'verified' ? 'Aug 2027' : '--'}
                  </span>
                </div>
              </div>

              <div className={styles.passBarcode}>
                {Array.from({ length: 28 }).map((_, i) => (
                  <span
                    key={i}
                    className={styles.bar}
                    style={{ height: `${10 + ((i * 37) % 22)}px` }}
                  />
                ))}
              </div>
              <span className={styles.passCode}>{PROMO_CODE}</span>
            </article>

            <p className={styles.passHint}>
              This is your digital student pass. Screenshot it or copy the code below
              once verified.
            </p>
          </div>

          {/* Verification flow */}
          <div className={styles.verifyCard}>
            <ol className={styles.stepsBar}>
              {['Choose method', 'Submit proof', 'Get your code'].map((label, i) => {
                const stepIndex = i + 1
                const current = status === 'verified' ? 3 : status === 'verifying' ? 2 : 1
                const state =
                  stepIndex < current ? 'done' : stepIndex === current ? 'active' : 'todo'
                return (
                  <li
                    key={label}
                    className={`${styles.stepItem} ${
                      state === 'active' ? styles.stepActive : ''
                    } ${state === 'done' ? styles.stepDone : ''}`}
                  >
                    <span className={styles.stepBubble}>
                      {state === 'done' ? <Check size={13} /> : stepIndex}
                    </span>
                    <span className={styles.stepLabel}>{label}</span>
                  </li>
                )
              })}
            </ol>

            {status !== 'verified' ? (
              <form className={styles.verifyForm} onSubmit={handleVerify}>
                <div className={styles.methodToggle} role="tablist" aria-label="Verification method">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={method === 'email'}
                    className={`${styles.methodTab} ${
                      method === 'email' ? styles.methodTabActive : ''
                    }`}
                    onClick={() => setMethod('email')}
                  >
                    <Mail size={15} />
                    <span>College Email</span>
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={method === 'id'}
                    className={`${styles.methodTab} ${
                      method === 'id' ? styles.methodTabActive : ''
                    }`}
                    onClick={() => setMethod('id')}
                  >
                    <IdCard size={15} />
                    <span>Student ID Card</span>
                  </button>
                </div>

                {method === 'email' ? (
                  <div className={styles.field}>
                    <label className={styles.fieldLabel} htmlFor="student-email">
                      College email address
                    </label>
                    <input
                      id="student-email"
                      type="email"
                      className={styles.fieldInput}
                      placeholder="name@university.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={status === 'verifying'}
                    />
                    <p className={styles.fieldNote}>
                      We send a one-tap confirmation link. Instant for most .edu domains.
                    </p>
                  </div>
                ) : (
                  <label className={styles.dropzone}>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      className={styles.dropzoneInput}
                      onChange={handleFileChange}
                      required={!fileName}
                      disabled={status === 'verifying'}
                    />
                    <IdCard size={26} className={styles.dropzoneIcon} />
                    {fileName ? (
                      <span className={styles.dropzoneFile}>{fileName}</span>
                    ) : (
                      <>
                        <span className={styles.dropzoneTitle}>
                          Drop your student ID here
                        </span>
                        <span className={styles.dropzoneSub}>
                          or tap to browse. JPG, PNG or PDF up to 5MB
                        </span>
                      </>
                    )}
                  </label>
                )}

                <button
                  type="submit"
                  className={styles.btnPrimary}
                  disabled={status === 'verifying'}
                >
                  {status === 'verifying' ? (
                    <>
                      <Loader2 size={16} className={styles.spinner} />
                      <span>Verifying…</span>
                    </>
                  ) : (
                    <>
                      <span>Verify my status</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className={styles.successPanel}>
                <div className={styles.successBadge}>
                  <BadgeCheck size={30} />
                </div>
                <h3 className={styles.successTitle}>You are verified</h3>
                <p className={styles.successSub}>
                  Your 20% student rate is live. Use the code below at checkout, or
                  just shop. It auto-applies to your account.
                </p>
                <div className={styles.codeBox}>
                  <span className={styles.codeText}>{PROMO_CODE}</span>
                  <button
                    type="button"
                    className={styles.copyBtn}
                    onClick={() => copyCode(PROMO_CODE)}
                    aria-label="Copy promo code"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ============ PERKS ============ */}
        <section className={styles.perksSection}>
          <ScrollReveal direction="up" delay={100}>
            <div className={styles.sectionHead}>
              <span className={styles.sectionEyebrow}>Member benefits</span>
              <h2 className={styles.sectionTitle}><SplitTextReveal text="Built for the semester grind" /></h2>
            </div>
          </ScrollReveal>
          <StaggerGrid className={styles.perksGrid}>
            {PERKS.map((perk, i) => (
              <article className={styles.perkCard} key={perk.title} style={{ ['--i' as string]: i }}>
                <span className={styles.perkIndex}>{String(i + 1).padStart(2, '0')}</span>
                <div className={styles.perkIcon}>
                  <perk.icon size={22} />
                </div>
                <h3 className={styles.perkTitle}>{perk.title}</h3>
                <p className={styles.perkBody}>{perk.body}</p>
              </article>
            ))}
          </StaggerGrid>
        </section>

        {/* ============ STATS BAND ============ */}
        <ScrollReveal direction="up" delay={100}>
          <section className={styles.statsBand}>
            <div className={styles.stat}>
              <span className={styles.statNumber}><CountUp value={20} suffix="%" duration={1400} /></span>
              <span className={styles.statLabel}>Flat off every drop</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}><CountUp value={48} suffix="h" duration={1300} /></span>
              <span className={styles.statLabel}>Early access window</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}><CountUp value={12} suffix="k+" duration={1500} /></span>
              <span className={styles.statLabel}>Students verified</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}><CountUp value={0} prefix="₹" duration={800} /></span>
              <span className={styles.statLabel}>Cost to join, ever</span>
            </div>
          </section>
        </ScrollReveal>

        {/* ============ TIERS ============ */}
        <section className={styles.tiersSection}>
          <ScrollReveal direction="up" delay={100}>
            <div className={styles.sectionHead}>
              <span className={styles.sectionEyebrow}>Climb the ladder</span>
              <h2 className={styles.sectionTitle}><SplitTextReveal text="Three tiers. One starts today." /></h2>
            </div>
          </ScrollReveal>
          <StaggerGrid className={styles.tiersGrid}>
            {TIERS.map((tier, i) => (
              <article
                key={tier.name}
                className={`${styles.tierCard} ${i === 0 ? styles.tierCardNow : ''}`}
              >
                {i === 0 && <span className={styles.tierNowTag}>You start here</span>}
                <h3 className={styles.tierName}>{tier.name}</h3>
                <p className={styles.tierTagline}>{tier.tagline}</p>
                <ul className={styles.tierList}>
                  {tier.benefits.map((b) => (
                    <li key={b} className={styles.tierItem}>
                      <Check size={14} className={styles.tierCheck} />
                      {b}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </StaggerGrid>
        </section>

        {/* ============ FAQ ============ */}
        <section className={styles.faqSection}>
          <ScrollReveal direction="up" delay={100}>
            <div className={styles.sectionHead}>
              <span className={styles.sectionEyebrow}>Good to know</span>
              <h2 className={styles.sectionTitle}><SplitTextReveal text="Questions, answered" /></h2>
            </div>
          </ScrollReveal>
          <StaggerGrid className={styles.faqList}>
            {FAQS.map((faq, i) => {
              const open = openFaq === i
              return (
                <div className={`${styles.faqItem} ${open ? styles.faqOpen : ''}`} key={faq.q}>
                  <button
                    type="button"
                    className={styles.faqQuestion}
                    onClick={() => setOpenFaq(open ? null : i)}
                    aria-expanded={open}
                  >
                    <span>{faq.q}</span>
                    <Plus size={18} className={styles.faqChevron} />
                  </button>
                  <div className={styles.faqAnswerWrap}>
                    <p className={styles.faqAnswer}>{faq.a}</p>
                  </div>
                </div>
              )
            })}
          </StaggerGrid>
        </section>

        {/* ============ CLOSING CTA ============ */}
        <ScrollReveal direction="up" delay={120}>
          <section className={styles.ctaBand}>
            <div>
              <h2 className={styles.ctaTitle}><SplitTextReveal text="Class is in session." /></h2>
              <p className={styles.ctaSub}>
                Verify once, save on every drop for the rest of the year.
              </p>
            </div>
            <a href="#verify" className={styles.btnPrimary}>
              <span>{status === 'verified' ? 'Verified, start shopping' : 'Get verified now'}</span>
              <ArrowRight size={16} />
            </a>
          </section>
        </ScrollReveal>
      </div>
    </div>
  )
}
