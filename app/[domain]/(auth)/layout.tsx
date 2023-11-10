import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Login | Platforms Starter Kit",
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="absolute bottom-0 left-0 right-0 top-0 flex min-h-screen w-full flex-col bg-gray-800 bg-[radial-gradient(circle_at_bottom_center,_var(--tw-gradient-stops))] from-brand-primary from-5% to-gray-200 to-30%  px-6 py-24  dark:bg-gray-800 dark:from-brand-primary/50 dark:to-gray-800 lg:px-6 lg:py-32">
      {children}
    </div>
  );
}
