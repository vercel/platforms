import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Login | Fora",
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-800 bg-[radial-gradient(circle_at_bottom_center,_var(--tw-gradient-stops))] from-brand-primary from-5% to-gray-200 to-60%  px-6 py-20  dark:bg-gray-800 dark:from-brand-primary/50 dark:to-gray-800 md:justify-center lg:px-8">
      {children}
    </div>
  );
}
