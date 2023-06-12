"use client";

import { SessionProvider } from "@auth/nextjs/client";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <Toaster />
      {children}
    </SessionProvider>
  );
}
