import "@/styles/globals.css";

import { Analytics } from "@vercel/analytics/react";
import { Metadata } from "next";

import { cn } from "@/lib/utils";
import { cal, inter } from "@/styles/fonts";

import { Providers } from "./providers";

const title = "Segtrace Console.";
const description =
  "Cross-platform deep linking, attribution & progressive onboarding for mobile growth teams.";
const image = "https://vercel.pub/thumbnail.png";

export const metadata: Metadata = {
  description,
  icons: ["https://vercel.pub/favicon.ico"],
  metadataBase: new URL("https://vercel.pub"),
  openGraph: {
    description,
    images: [image],
    title,
  },
  title,
  twitter: {
    card: "summary_large_image",
    creator: "@vercel",
    description,
    images: [image],
    title,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(cal.variable, inter.variable)}>
        <Providers>
          {children}
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
