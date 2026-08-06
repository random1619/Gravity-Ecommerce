import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Student Offer & Rewards | GRAVITY',
  description: 'Verify your student ID for an instant 20% discount and earn Gravity Coins on every drop. Join the GRAVITY campus tier.',
}

export default function RewardsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
