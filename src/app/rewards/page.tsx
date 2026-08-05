'use client'

import React, { useState } from 'react'
import styles from './page.module.css'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import Button from '@/components/ui/Button'
import { useAuth } from '@/lib/AuthContext'

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
  const [points, setPoints] = useState(650)
  const [rewards, setRewards] = useState<RewardItem[]>([
    { id: '1', title: 'Rs. 200 Voucher', cost: 400, description: 'Get flat Rs. 200 off on any order. Minimum purchase Rs. 999.' },
    { id: '2', title: 'Free Express Shipping', cost: 150, description: 'Skip the standard delivery queues. Valid on next 3 orders.' },
    { id: '3', title: 'Rs. 500 Gift Card', cost: 800, description: 'Redeem flat Rs. 500 discount on your bag. No minimum order value.' }
  ])
  const [challenges, setChallenges] = useState<Challenge[]>([
    { id: 1, title: 'Verify Student ID', points: 150, progress: 'Completed', completed: true },
    { id: 2, title: 'Make Your First Drop Purchase', points: 200, progress: 'Completed', completed: true },
    { id: 3, title: 'Write 3 Product Reviews', points: 100, progress: '1/3 Reviews', completed: false }
  ])

  const handleRedeem = (id: string, cost: number) => {
    if (points < cost) {
      alert('Not enough Gravity Coins! Complete challenges to earn more.')
      return
    }

    setPoints(prev => prev - cost)
    setRewards(current =>
      current.map(r =>
        r.id === id
          ? { ...r, redeemedCode: `GRAV-${Math.random().toString(36).substring(2, 8).toUpperCase()}` }
          : r
      )
    )
  }

  return (
    <div className={styles.rewardsPage}>
      <div className="container">
        <Breadcrumbs />
        
        <header className={styles.header}>
          <span className={styles.clubBadge}>GRAVITY CLUB</span>
          <h1 className={styles.title}>LOYALTY & STUDENT REWARDS</h1>
          <p className={styles.subtitle}>
            Earn Gravity Coins on every drop, complete campus missions, and unlock exclusive streetwear discounts.
          </p>
        </header>

        {!isAuthenticated ? (
          <div className={styles.loginBanner}>
            <h2>Join the Club</h2>
            <p>Please login to start tracking your Gravity Coins, missions, and rewards.</p>
          </div>
        ) : (
          <div className={styles.dashboard}>
            {/* Balance Card */}
            <div className={styles.balanceCard}>
              <div className={styles.balanceInfo}>
                <p>Welcome, {user?.name}</p>
                <h2>{points} <span>Coins</span></h2>
                <p className={styles.tierName}>⭐️ Gold Tier Member</p>
              </div>
              <div className={styles.progressContainer}>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{ width: '65%' }} />
                </div>
                <div className={styles.progressLabels}>
                  <span>Gold Tier</span>
                  <span>150 coins to Platinum Tier</span>
                </div>
              </div>
            </div>

            <div className={styles.rewardsLayout}>
              {/* Vouchers section */}
              <section className={styles.rewardsSection}>
                <h2>Redeem Vouchers</h2>
                <div className={styles.rewardsGrid}>
                  {rewards.map(reward => (
                    <div key={reward.id} className={styles.rewardCard}>
                      <h3>{reward.title}</h3>
                      <span className={styles.costBadge}>{reward.cost} Coins</span>
                      <p>{reward.description}</p>
                      
                      {reward.redeemedCode ? (
                        <div className={styles.redeemedBox}>
                          <p>Redeemed Code:</p>
                          <code>{reward.redeemedCode}</code>
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
              </section>

              {/* Missions Section */}
              <aside className={styles.missionsSection}>
                <h2>Missions & Challenges</h2>
                <div className={styles.challengesList}>
                  {challenges.map(ch => (
                    <div key={ch.id} className={`${styles.chCard} ${ch.completed ? styles.chCompleted : ''}`}>
                      <div className={styles.chHeader}>
                        <h4>{ch.title}</h4>
                        <span className={styles.chPoints}>+{ch.points} Coins</span>
                      </div>
                      <div className={styles.chMeta}>
                        <span>Status: {ch.progress}</span>
                        {ch.completed && <span className={styles.check}>✓ Done</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </aside>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
