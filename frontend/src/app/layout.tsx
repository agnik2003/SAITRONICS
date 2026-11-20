import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Toaster } from 'react-hot-toast';
import SyncProvider from '@/components/providers/SyncProvider';

export const metadata: Metadata = {
  metadataBase: new URL('https://saitronics.com'),
  title: {
    default: 'SAITRONICS — Technology. Style. Experience. | Luxury Electronics',
    template: '%s | Saitronics Luxury Electronics',
  },
  description: 'Experience authentic flagship smartphones, OLED computing, and audiophile acoustics at Saitronics Uttarpara showroom. Official manufacturer warranties.',
  keywords: ['Saitronics', 'luxury electronics', 'flagship smartphones', 'Uttarpara', 'iPhone', 'Huawei RS', 'Samsung Galaxy', 'MacBook', 'audio'],
  authors: [{ name: 'Saitronics' }, { name: 'SM Software Resource Capital (SMSRC)' }],
  creator: 'Saitronics',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://saitronics.com',
    siteName: 'Saitronics',
    title: 'SAITRONICS — Technology. Style. Experience.',
    description: 'Black & Red Luxury Electronics E-Commerce Experience. Showroom at Uttarpara, West Bengal.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="min-h-screen flex flex-col bg-[#090909] text-white selection:bg-[#E50924] selection:text-white">
        <SyncProvider>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </SyncProvider>
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: '#111111',
              color: '#FFFFFF',
              border: '1px solid #E50924',
              borderRadius: '16px',
              padding: '14px 22px',
              fontSize: '13px',
              fontWeight: '600',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.7)',
            },
            success: {
              iconTheme: { primary: '#E50924', secondary: '#FFFFFF' },
            },
            error: {
              iconTheme: { primary: '#FF3048', secondary: '#FFFFFF' },
            },
          }}
        />
      </body>
    </html>
  );
}
