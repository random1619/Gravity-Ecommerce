'use client'

import React, { useState } from 'react'
import styles from './page.module.css'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import Button from '@/components/ui/Button'
import Toast from '@/components/ui/Toast'
import SplitTextReveal from '@/components/motion/SplitTextReveal'
import ScrollReveal from '@/components/motion/ScrollReveal'
import StaggerGrid from '@/components/motion/StaggerGrid'
import { useAuth } from '@/lib/AuthContext'
import {
  Tag,
  Key,
  Truck,
  Gift,
  Check,
  Copy,
  Upload,
  Loader2,
  ArrowRight,
  Sparkles
} from 'lucide-react'

interface RewardItem {
  id: string
  title: string
  cost: number
  description: string
  redeemedCode?: string
}

interface Challenge {
  id: number
  title: string
  points: number
  progress: string
  completed: boolean
}

export default function RewardsPage() {
  const { isAuthenticated, user } = useAuth()

  // State
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [email, setEmail] = useState('')
  const [fileName, setFileName] = useState<string | null>(null)
  const [isVerified, setIsVerified] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const [points, setPoints] = useState(650)
  const [rewards, setRewards] = useState<RewardItem[]>([
    {
      id: '1',
      title: 'Rs. 200 Voucher',
      cost: 400,
      description: 'Get flat Rs. 200 off on any order. Minimum purchase Rs. 999.'
    },
    {
      id: '2',
      title: 'Free Express Shipping',
      cost: 150,
      description: 'Skip the standard delivery queues. Valid on next 3 orders.'
    },
    {
      id: '3',
      title: 'Rs. 500 Gift Card',
      cost: 800,
      description: 'Redeem flat Rs. 500 discount on your bag. No minimum order value.'
    },
    {
      id: '4',
      title: 'Secret Drop Access Pass',
      cost: 1000,
      description: 'Guaranteed early access link sent 2 hours before general drop.'
    }
  ])

  const [challenges, setChallenges] = useState<Challenge[]>([
    {
      id: 1,
      title: 'Verify Student ID',
      points: 150,
      progress: 'Awaiting Verification',
      completed: false
    },
    {
      id: 2,
      title: 'Make Your First Drop Purchase',
      points: 200,
      progress: 'Completed',
      completed: true
    },
    {
      id: 3,
      title: 'Write 3 Product Reviews',
      points: 100,
      progress: '1/3 Reviews',
      completed: false
    },
    {
      id: 4,
      title: 'Follow @GRAVITY on Instagram',
      points: 50,
      progress: 'Completed',
      completed: true
    }
  ])

  // File upload handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name)
    }
  }

  // Handle student verification submission
  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep(2) // loading state

    setTimeout(() => {
      setStep(3) // verified success state
      setIsVerified(true)

      // Award bonus points & update mission status
      setPoints((prev) => prev + 150)
      setChallenges((prev) =>
        prev.map((c) =>
          c.id === 1 ? { ...c, progress: 'Completed', completed: true } : c
        )
      )
      setToastMessage('Student status verified! +150 Gravity Coins added.')
    }, 2000)
  }

  // Copy code to clipboard helper
  const copyToClipboard = (code: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code)
      setToastMessage(`Code "${code}" copied to clipboard!`)
    }
  }

  // Redeem rewards handler
  const handleRedeem = (id: string, cost: number) => {
    if (points < cost) {
      setToastMessage('Not enough Gravity Coins! Complete missions to earn more.')
      return
    }

    const generatedCode = `GRV-REWARD-${id}0X`
    setPoints((prev) => prev - cost)
    setRewards((current) =>
      current.map((r) =>
        r.id === id ? { ...r, redeemedCode: generatedCode } : r
      )
    )
    setToastMessage(`Successfully redeemed! Code: ${generatedCode}`)
  }

  return (
    <div className={styles.rewardsPage}>
      {toastMessage && (
        <Toast
          message={toastMessage}
          type="success"
          onClose={() => setToastMessage(null)}
        />
      )}

      <div className={`container ${styles.mainContainer}`}>
        <Breadcrumbs />

        {/* --- Hero Section & Integrated Verification Widget --- */}
        <section className={styles.heroSection}>
          <div className={styles.heroLeft}>
            <div className={styles.badgesRow}>
              <span className={styles.badgePrimary}>Instant Verification</span>
              <span className={styles.badgeSecondary}>•</span>
              <span className={styles.badgeSecondary}>No Annual Fee</span>
              <span className={styles.badgeSecondary}>•</span>
              <span className={styles.badgeSecondary}>Valid Across All Drops</span>
            </div>

            <h1 className={styles.heroTitle}>
              <SplitTextReveal text="VERIFIED STUDENT" />{' '}
              <span className={styles.heroHighlight}><SplitTextReveal text="DISCOUNT" delay={0.12} /></span>{' '}
              <SplitTextReveal text="& REWARDS" delay={0.24} />
            </h1>

            <ScrollReveal direction="up" delay={150}>
              <p className={styles.heroDescription}>
                Get an extra 20% OFF every drop + 150 bonus Gravity Coins. Verify your
                student ID in under 30 seconds and secure your access to exclusive campus
                tier benefits.
              </p>
            </ScrollReveal>
          </div>

          {/* Integrated Verification Widget */}
          <div className={styles.widgetContainer}>
            <div className={styles.widgetHeader}>
              <h2 className={styles.widgetTitle}>Verify Status</h2>
              <div className={styles.statusIndicator}>
                <span
                  className={`${styles.statusText} ${
                    isVerified ? styles.statusTextVerified : ''
                  }`}
                >
                  {step === 1
                    ? 'Awaiting'
                    : step === 2
                    ? 'Authenticating...'
                    : 'Verified'}
                </span>
                <div
                  className={`${styles.statusDot} ${
                    step === 1
                      ? styles.statusDotPulse
                      : step === 2
                      ? styles.statusDotPulse
                      : styles.statusDotActive
                  }`}
                />
              </div>
            </div>

            {step === 1 && (
              <form className={styles.verifyForm} onSubmit={handleVerifySubmit}>
                <div className={styles.stepContent}>
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel} htmlFor="uni-email">
                      College Email (.edu)
                    </label>
                    <input
                      id="uni-email"
                      type="email"
                      className={styles.minimalInput}
                      placeholder="name@university.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required={!fileName}
                    />
                  </div>

                  <div className={styles.divider}>
                    <div className={styles.dividerLine} />
                    <span className={styles.dividerText}>OR</span>
                  </div>

                  <label className={styles.uploadBox}>
                    <input
                      type="file"
                      accept="image/*"
                      className={styles.fileInputHidden}
                      onChange={handleFileChange}
                    />
                    <Upload size={24} className={styles.uploadIcon} />
                    {fileName ? (
                      <span className={styles.fileNameBadge}>{fileName}</span>
                    ) : (
                      <>
                        <p className={styles.uploadTitle}>
                          Drag & Drop Student ID
                        </p>
                        <p className={styles.uploadSubtitle}>
                          JPEG, PNG up to 5MB
                        </p>
                      </>
                    )}
                  </label>

                  <button type="submit" className={styles.verifyBtn}>
                    <span>Verify Identity</span>
                    <ArrowRight size={16} className={styles.btnIcon} />
                  </button>
                </div>
              </form>
            )}

            {step === 2 && (
              <div className={styles.loadingStep}>
                <Loader2 size={36} className={styles.spinner} />
                <p className={styles.loadingText}>Authenticating...</p>
              </div>
            )}

            {step === 3 && (
              <div className={styles.successStep}>
                <div className={styles.successCheckIcon}>
                  <Check size={28} />
                </div>
                <div>
                  <h3 className={styles.successHeading}>Verified</h3>
                  <p className={styles.successSubtext}>
                    Status active until August 2026.
                  </p>
                </div>

                <div className={styles.promoCodeBox}>
                  <span className={styles.promoCodeText}>GRV-STU-24X</span>
                  <button
                    type="button"
                    className={styles.copyBtn}
                    onClick={() => copyToClipboard('GRV-STU-24X')}
                    title="Copy Promo Code"
                  >
                    <Copy size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* --- Campus Perks Grid Section --- */}
        <section className={styles.perksSection}>
          <ScrollReveal direction="up" delay={100}>
            <div className={styles.perksHeader}>
              <h2 className={styles.perksTitle}><SplitTextReveal text="Campus Perks" /></h2>
              <p className={styles.perksSubtitle}>
                Exclusive benefits for verified academics.
              </p>
            </div>
          </ScrollReveal>

          <StaggerGrid className={styles.perksGrid}>
            <div className={styles.perkCard}>
              <div className={styles.perkIconWrapper}>
                <Tag size={20} />
              </div>
              <div>
                <h3 className={styles.perkTitle}>Flat 20% Off</h3>
                <p className={styles.perkDescription}>
                  Every drop. Stackable with items under ₹999.
                </p>
              </div>
            </div>

            <div className={styles.perkCard}>
              <div className={styles.perkIconWrapper}>
                <Key size={20} />
              </div>
              <div>
                <h3 className={styles.perkTitle}>Campus Rep Access</h3>
                <p className={styles.perkDescription}>
                  Exclusive invites to secret, unlisted drops.
                </p>
              </div>
            </div>

            <div className={styles.perkCard}>
              <div className={styles.perkIconWrapper}>
                <Truck size={20} />
              </div>
              <div>
                <h3 className={styles.perkTitle}>Free Shipping</h3>
                <p className={styles.perkDescription}>
                  On all orders over ₹1200 across the country.
                </p>
              </div>
            </div>

            <div className={styles.perkCard}>
              <div className={styles.perkIconWrapper}>
                <Gift size={20} />
              </div>
              <div>
                <h3 className={`${styles.perkTitle} ${styles.perkTitleAccent}`}>
                  Birthday Bonus
                </h3>
                <p className={styles.perkDescription}>
                  Surprise store credits deposited on your special day.
                </p>
              </div>
            </div>
          </StaggerGrid>
        </section>

        {/* --- Loyalty & Club Rewards Dashboard --- */}
        <section className={styles.loyaltySection}>
          {!isAuthenticated ? (
            <div className={styles.unauthBanner}>
              <h2 className={styles.unauthTitle}>Join Gravity Club</h2>
              <p className={styles.unauthDesc}>
                Login to your account to track your Gravity Coins, redeem streetwear
                vouchers, and climb up membership tiers.
              </p>
            </div>
          ) : (
            <>
              {/* Balance Summary Card */}
              <div className={styles.balanceCard}>
                <div className={styles.balanceCardHeader}>
                  <div>
                    <p className={styles.welcomeUser}>
                      Welcome back, {user?.name || 'Member'}
                    </p>
                    <h2 className={styles.pointsAmount}>
                      {points}
                      <span className={styles.pointsLabel}>Coins</span>
                    </h2>
                  </div>
                  <div className={styles.tierBadge}>
                    <Sparkles size={14} /> Gold Tier Member
                  </div>
                </div>

                <div className="space-y-2">
                  <div className={styles.progressTrack}>
                    <div
                      className={styles.progressFill}
                      style={{ width: `${Math.min(100, (points / 1000) * 100)}%` }}
                    />
                  </div>
                  <div className={styles.progressMeta}>
                    <span>Gold Tier</span>
                    <span>{Math.max(0, 1000 - points)} coins to Platinum Tier</span>
                  </div>
                </div>
              </div>

              {/* Grid: Redeem Vouchers & Missions */}
              <div className={styles.dashboardGrid}>
                {/* Vouchers Column */}
                <div>
                  <h3 className={styles.rewardsSubheading}>Redeem Vouchers</h3>
                  <div className={styles.vouchersGrid}>
                    {rewards.map((reward) => (
                      <div key={reward.id} className={styles.voucherCard}>
                        <h4 className={styles.voucherTitle}>{reward.title}</h4>
                        <span className={styles.costBadge}>
                          {reward.cost} Coins
                        </span>
                        <p className={styles.voucherDesc}>
                          {reward.description}
                        </p>

                        {reward.redeemedCode ? (
                          <div className={styles.redeemedBox}>
                            <span className={styles.redeemedCode}>
                              {reward.redeemedCode}
                            </span>
                            <button
                              type="button"
                              className={styles.copyBtn}
                              onClick={() => copyToClipboard(reward.redeemedCode!)}
                            >
                              <Copy size={14} />
                            </button>
                          </div>
                        ) : (
                          <Button
                            variant={points >= reward.cost ? 'primary' : 'outline'}
                            size="sm"
                            onClick={() => handleRedeem(reward.id, reward.cost)}
                            disabled={points < reward.cost}
                          >
                            Redeem
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Missions Column */}
                <div>
                  <h3 className={styles.rewardsSubheading}>Missions</h3>
                  <div className={styles.missionsList}>
                    {challenges.map((ch) => (
                      <div
                        key={ch.id}
                        className={`${styles.missionCard} ${
                          ch.completed ? styles.missionCardCompleted : ''
                        }`}
                      >
                        <div>
                          <h4 className={styles.missionTitle}>{ch.title}</h4>
                          <p className={styles.missionStatus}>
                            Status: {ch.progress}
                          </p>
                        </div>
                        <div className={styles.missionRight}>
                          <span className={styles.missionPoints}>
                            +{ch.points} Coins
                          </span>
                          {ch.completed && (
                            <span className={styles.missionCheck}>
                              <Check size={12} /> Done
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  )
}
