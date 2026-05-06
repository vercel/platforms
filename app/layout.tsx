import type { Metadata } from 'next';
import { Inter, Oswald } from 'next/font/google';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { ThemeProvider } from '@/components/theme-provider';
import './globals.css';

const fontSans = Inter({ subsets: ['latin'], variable: '--font-sans' });
const fontBrand = Oswald({ subsets: ['latin'], weight: ['600'], variable: '--font-brand' });

export const metadata: Metadata = {
  title: 'Academy Pool Pro',
  description: 'Soccer academy management platform.'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${fontSans.variable} ${fontBrand.variable}`}>
      <body className="bg-background antialiased">
        <ThemeProvider>
          {children}
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  );
}
