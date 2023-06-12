import "@/styles/globals.css";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | Platforms Starter Kit",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {children}
    </div>
  );
}
