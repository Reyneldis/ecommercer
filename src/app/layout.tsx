import type { Metadata } from 'next';
import { Onest } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/shared/Navbar/Navbar';
import { Toaster } from 'sonner';

import NextTopLoader from 'nextjs-toploader';
import Footer from '@/components/shared/footer/Footer';
import { ThemeProvider } from 'next-themes';
import { ClerkProvider } from '@clerk/nextjs';
import AnimatedBackground from '@/components/shared/AnimatedBackground';

const onest = Onest({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Tienda',
  description: 'Tienda online',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="es" suppressHydrationWarning>
        <body
          className={`${onest.className} min-h-screen relative bg-transparent`}
        >
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
            <Toaster />
            <Footer />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
