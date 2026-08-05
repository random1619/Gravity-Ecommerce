import type { Metadata, Viewport } from "next";
import './globals.css';
import { Inter } from 'next/font/google';
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

const inter = Inter({ subsets: ['latin'] });

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
      <body className={inter.className}>
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
                          {children}
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
