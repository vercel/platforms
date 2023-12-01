import "@/styles/globals.css";
import { avenirNext, cal, inter, reckless, recklessNeue } from "@/styles/fonts";
import { Analytics } from "@vercel/analytics/react";
import { Providers } from "./providers";
import { Metadata } from "next";
import { cn } from "@/lib/utils";

const title = "Fora - Tools for startup cities";
const description =
  "Fora is an open source suite of tools for startup city builders.";
const image =
  "https://ooybxjivdvmpbxtwunrr.supabase.co/storage/v1/object/public/media/public/fora-globe";

export const metadata: Metadata = {
  title,
  description,
  icons: ["/fora-logo.png"],
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
  metadataBase: new URL("https://fora.co"),
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
          "bg-gray-100 font-default text-gray-900 dark:bg-gray-900 dark:text-gray-100",
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
