import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Lookbook — Style Editorial Nº 26 | GRAVITY',
  description:
    'Four fits, curated for the semester. Scroll the rack sideways, hover the pins to inspect each garment, and shop the full look. Autumn–Winter ’26.',
}

export default function LookbookLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
