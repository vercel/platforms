import localFont from "next/font/local";
import { Inter, Lora, Work_Sans } from "next/font/google";

export const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});
export const cal = localFont({
  src: "./CalSans-SemiBold.otf",
  variable: "--font-cal",
  weight: "600",
  display: "swap",
});

export const calTitle = localFont({
  src: "./CalSans-SemiBold.otf",
  variable: "--font-title",
  weight: "600",
  display: "swap",
});
export const lora = Lora({
  variable: "--font-title",
  subsets: ["latin"],
  weight: "600",
  display: "swap",
});
export const work = Work_Sans({
  variable: "--font-title",
  subsets: ["latin"],
  weight: "600",
  display: "swap",
});

export const reckless = localFont({
  src: [
    { path: "./RecklessVF-Uprights.woff2", style: "normal" },
    { path: "./RecklessVF-Italics.woff2", style: "italic" },
  ],
  variable: "--font-reckless",
  weight: "variable",
  display: "swap",
});

export const recklessNeue = localFont({
  src: [
    { path: "./RecklessNeueVF-Uprights.woff2", style: "normal" },
    { path: "./RecklessNeueVF-Italics.woff2", style: "italic" },
  ],
  variable: "--font-reckless-neue",
  weight: "variable",
  display: "swap",
});

export const avenirNext = localFont({
  src: [
    { path: "./avenir-next/avenir-next-ultralight.woff2", style: "normal", weight: "100" },
    { path: "./avenir-next/avenir-next-regular.woff2", style: "normal", weight: "400" },
    { path: "./avenir-next/avenir-next-medium.woff2", style: "normal", weight: "500" },
    { path: "./avenir-next/avenir-next-demibold.woff2", style: "normal", weight: "600" },
    { path: "./avenir-next/avenir-next-bold.woff2", style: "normal", weight: "700" },
  ],
  variable: "--font-avenir-next",
  display: "swap",
});

export const fontMapper = {
  "font-cal": calTitle.variable,
  "font-lora": lora.variable,
  "font-work": work.variable,
  "font-reckless": reckless.variable,
  "font-reckless-neue": reckless.variable,
  "font-avenir-next": avenirNext.variable,
} as Record<string, string>;
