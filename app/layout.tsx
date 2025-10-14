import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Source_Serif_4, JetBrains_Mono } from 'next/font/google';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from 'sonner';
import Script from 'next/script';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
});

const sourceSerif4 = Source_Serif_4({
  variable: '--font-serif',
  subsets: ['latin'],
  display: 'swap',
});

const jetBrainsMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'OakRidge AI - Smart AI Automation for Business',
    template: '%s | OakRidge AI'
  },
  description: 'White-glove AI automation platform that reads, understands, and acts on your business data automatically. Transform your operations with intelligent agents.',
  keywords: ['AI automation', 'business intelligence', 'workflow automation', 'AI agents', 'data processing'],
  authors: [{ name: 'OakRidge AI' }],
  creator: 'OakRidge AI',
  publisher: 'OakRidge AI',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://app.oakridge.ai'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'OakRidge AI - Smart AI Automation for Business',
    description: 'White-glove AI automation platform that reads, understands, and acts on your business data automatically.',
    url: 'https://app.oakridge.ai',
    siteName: 'OakRidge AI',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'OakRidge AI - Smart AI Automation Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OakRidge AI - Smart AI Automation for Business',
    description: 'White-glove AI automation platform that reads, understands, and acts on your business data automatically.',
    images: ['/images/og-image.png'],
    creator: '@oakridgeai',
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
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },

    ],

  },
  manifest: '/manifest.json',
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Tag Manager */}
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','G-CV6W14EG0Y');
            `,
          }}
        />
      </head>
      <body className={`${plusJakartaSans.variable} ${sourceSerif4.variable} ${jetBrainsMono.variable} antialiased`}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=G-CV6W14EG0Y"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        
        <ThemeProvider>
          {children}
          <Toaster 
            position="top-right"
            expand={false}
            richColors
            closeButton
          />
        </ThemeProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
