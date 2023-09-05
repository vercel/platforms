import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Login | Platforms Starter Kit",
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col md:justify-center py-20 px-6 lg:px-8  bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-brand-primary/10  to-brand-magenta/5">
      {children}
    </div>
  );
}
