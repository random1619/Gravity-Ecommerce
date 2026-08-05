import type { Metadata, Viewport } from "next";
import './globals.css';
import { Inter, Poppins, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
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

const inter = Inter({ subsets: ['latin'], variable: '--font-body' });
const poppins = Poppins({ subsets: ['latin'], weight: ['600', '700', '800', '900'], variable: '--font-display' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], weight: ['500', '600', '700'], variable: '--font-accent' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-mono' });

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
      <body className={`${inter.variable} ${poppins.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
        {/* Apply saved theme before first paint to prevent FOUC */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('theme');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.setAttribute('data-theme',t)}catch(e){}`,
          }}
        />
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
