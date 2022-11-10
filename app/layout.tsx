// These styles apply to every route in the application
import "@/styles/globals.css";
import localFont from "@next/font/local";
import { Inter } from "@next/font/google";
import cx from "classnames";

const cal = localFont({
  src: "./CalSans-SemiBold.woff2",
  variable: "--font-cal",
  weight: "600",
  display: "swap",
  style: "normal",
});

const inter = Inter({
  variable: "--font-inter",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className={cx(cal.variable, inter.variable)}>{children}</body>
    </html>
  );
}
