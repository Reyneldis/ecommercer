import type { Metadata, Viewport } from 'next';
import { Onest } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/shared/Navbar/Navbar';
import { Toaster } from 'sonner';

import NextTopLoader from 'nextjs-toploader';
import Footer from '@/components/shared/footer/Footer';
import { ThemeProvider } from 'next-themes';
import { ClerkProvider } from '@clerk/nextjs';
import AnimatedBackground from '@/components/shared/AnimatedBackground';
import { ClientProviders } from '@/components/ClientProviders';

const onest = Onest({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-onest',
});

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f0f23' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://tu-tienda-premium.com'),
  title: {
    default: 'Delivery Express - Tienda Online Premium',
    template: '%s | Delivery Express',
  },
  description:
    'Descubre productos exclusivos y de alta calidad en nuestra tienda online premium. Envío gratis, garantía de 30 días y atención personalizada. La mejor experiencia de compra online.',
  keywords: [
    'tienda online',
    'productos premium',
    'compras online',
    'envío gratis',
    'garantía',
    'productos exclusivos',
    'ecommerce',
    'shopping online',
    'moda',
    'accesorios',
    'tecnología',
    'hogar',
  ],
  authors: [{ name: 'Delivery Express Team' }],
  creator: 'Delivery Express',
  publisher: 'Delivery Express',

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://delivery-express.com',
    siteName: 'Delivery Express',
    title: 'Delivery Express - Tienda Online Premium',
    description:
      'Tienda Online Premium con productos exclusivos y de alta calidad',

    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Delivery Express - Tienda Online Premium',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@deliveryexpress',
    creator: '@deliveryexpress',
    title: 'Delivery Express - Tienda Online Premium',
    description:
      'Descubre productos exclusivos y de alta calidad en nuestra tienda online premium.',
    images: ['/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'tu-google-verification-code',
    yandex: 'tu-yandex-verification-code',
    yahoo: 'tu-yahoo-verification-code',
  },
  alternates: {
    canonical: 'https://delivery-express.com',
    languages: {
      'es-ES': 'https://delivery-express.com',
      'en-US': 'https://delivery-express.com/en',
    },
  },
  category: 'ecommerce',
  classification: 'shopping',
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'Delivery Express',
    'application-name': 'Delivery Express',

    'msapplication-TileColor': '#2563eb',
    'msapplication-config': '/browserconfig.xml',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="es" suppressHydrationWarning className={onest.variable}>
        <head>
          {/* Preconnect para mejorar performance */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />

          {/* DNS Prefetch para recursos externos */}
          <link rel="dns-prefetch" href="//cdn.jsdelivr.net" />
          <link rel="dns-prefetch" href="//fonts.googleapis.com" />

          {/* Favicon y iconos */}
          <link rel="icon" href="/favicon.ico" sizes="any" />
          <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
          <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
          <link rel="manifest" href="/manifest.json" />

          {/* Structured Data para SEO */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'Organization',
                name: 'Tienda Premium',
                url: 'https://tu-tienda-premium.com',
                logo: 'https://tu-tienda-premium.com/logo.png',
                description:
                  'Tienda online premium con productos exclusivos y de alta calidad',
                address: {
                  '@type': 'PostalAddress',
                  addressCountry: 'ES',
                },
                contactPoint: {
                  '@type': 'ContactPoint',
                  contactType: 'customer service',
                  availableLanguage: 'Spanish',
                },
                sameAs: [
                  'https://facebook.com/tiendapremium',
                  'https://twitter.com/tiendapremium',
                  'https://instagram.com/tiendapremium',
                ],
              }),
            }}
          />
        </head>
        <body
          className={`${onest.className} min-h-screen relative bg-transparent antialiased`}
        >
          <ClientProviders>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <AnimatedBackground />
              <NextTopLoader
                color="#2563eb"
                initialPosition={0.08}
                crawlSpeed={200}
                height={3}
                crawl={true}
                showSpinner={false}
                easing="ease"
                speed={200}
                shadow="0 0 10px #2563eb,0 0 5px #2563eb"
              />
              <Navbar />
              <main className="relative z-10 min-h-screen bg-transparent">
                {children}
              </main>
              <Toaster
                position="bottom-right"
                richColors
                closeButton
                duration={4000}
              />
              <Footer />
            </ThemeProvider>
          </ClientProviders>
        </body>
      </html>
    </ClerkProvider>
  );
}
