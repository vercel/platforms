import PlausibleProvider from "next-plausible";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";

import "@/styles/globals.css";

import type { AppProps } from "next/app";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) {
  return (
    <PlausibleProvider domain="demo.vercel.pub">
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </PlausibleProvider>
  );
}
