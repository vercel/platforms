import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Login | Platforms Starter Kit",
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-brand-gray800 dark:bg-brand-gray800 flex-col md:justify-center py-20 px-6 lg:px-8  bg-[radial-gradient(circle_at_bottom_center,_var(--tw-gradient-stops))] from-brand-primary  dark:from-brand-primary/50 from-5% to-brand-gray200 dark:to-brand-gray800 to-60%">
      {children}
    </div>
  );
}
