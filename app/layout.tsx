import "@/styles/globals.css";
import { avenirNext, cal, inter, reckless, recklessNeue } from "@/styles/fonts";
import { Analytics } from "@vercel/analytics/react";
import { Providers } from "./providers";
import { Metadata } from "next";
import { cn } from "@/lib/utils";

const title =
  "Tools for startup cities";
const description =
  "Open source multi chain";
const image = "https://vercel.pub/thumbnail.png";

export const metadata: Metadata = {
  title,
  description,
  icons: ["https://vercel.pub/favicon.ico"],
  openGraph: {
    title,
    description,
    images: [image],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [image],
    creator: "@vercel",
  },
  metadataBase: new URL("https://vercel.pub"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          recklessNeue.variable,
          avenirNext.variable,
          cal.variable,
          inter.variable,
          'bg-brand-gray200 dark:bg-brand-gray900 text-brand-gray900 dark:text-brand-gray200 font-default'
        )}
      >
        <Providers>
          {children}
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
