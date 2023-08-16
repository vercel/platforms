import { Inter, Lora, Work_Sans } from "next/font/google";
import localFont from "next/font/local";

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});
export const cal = localFont({
  display: "swap",
  src: "./CalSans-SemiBold.otf",
  variable: "--font-cal",
  weight: "600",
});

export const calTitle = localFont({
  display: "swap",
  src: "./CalSans-SemiBold.otf",
  variable: "--font-title",
  weight: "600",
});
export const lora = Lora({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-title",
  weight: "600",
});
export const work = Work_Sans({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-title",
  weight: "600",
});

export const fontMapper = {
  "font-cal": calTitle.variable,
  "font-lora": lora.variable,
  "font-work": work.variable,
} as Record<string, string>;
