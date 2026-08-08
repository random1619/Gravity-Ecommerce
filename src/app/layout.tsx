import type { Metadata, Viewport } from "next";
import './globals.css';
import { Inter, Playfair_Display, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import DemoWarning from '@/components/ui/DemoWarning';
import CustomCursor from '@/components/ui/CustomCursor';
import SmoothScroll from '@/components/ui/SmoothScroll';
import PageTransition from '@/components/ui/PageTransition';
import { AuthProvider } from '@/lib/AuthContext';
import { CartProvider } from '@/lib/CartContext';
import { WishlistProvider } from '@/lib/WishlistContext';
import { RecentlyViewedProvider } from '@/lib/RecentlyViewedContext';
import { ThemeProvider } from '@/lib/ThemeContext';
import { DeviceTierProvider } from '@/hooks/useDeviceTier';
import ClientWebGLCanvas from '@/components/three/ClientWebGLCanvas';
import ErrorBoundary from '@/components/ui/ErrorBoundary';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
});
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'GRAVITY - Streetwear for Students (DEMO)',
  description: 'Premium streetwear designed for students. Bold, affordable, authentic. [DEMO SITE]',
  robots: 'noindex, nofollow', // Prevent search engine indexing of demo site
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfairDisplay.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} ${inter.className}`}>
        <ThemeProvider>
          <DeviceTierProvider>
            <AuthProvider>
              <CartProvider>
                <WishlistProvider>
                  <RecentlyViewedProvider>
                    <ClientWebGLCanvas />
                    <CustomCursor />
                    <DemoWarning />
                    <Navbar />
                    <SmoothScroll>
                      <PageTransition>
                        <ErrorBoundary>
                          {/* Main landmark — every page renders inside this so screen
                              readers get a "main" region and axe's landmark-one-main passes. */}
                          <main id="main-content">
                            {children}
                          </main>
                        </ErrorBoundary>
                      </PageTransition>
                    </SmoothScroll>
                    <Footer />
                  </RecentlyViewedProvider>
                </WishlistProvider>
              </CartProvider>
            </AuthProvider>
          </DeviceTierProvider>
          </ThemeProvider>
      </body>
    </html>
  );
}
