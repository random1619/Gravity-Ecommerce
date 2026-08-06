import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Student Discount | GRAVITY',
  description: 'Get an extra 20% OFF every drop. Verify your student status instantly with GRAVITY.',
}

export default function DiscountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
