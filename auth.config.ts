import type { NextAuthConfig } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { NextResponse } from "next/server";
import { getHostname } from "./lib/utils";

const VERCEL_DEPLOYMENT = !!process.env.VERCEL_URL;

declare module "next-auth/types" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      createdAt: Date;
    };
  }
}

export default {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          gh_username: profile.login,
          email: profile.email,
          image: profile.avatar_url,
        };
      },
    }),
  ],
  pages: {
    signIn: `/login`,
    verifyRequest: `/login`,
    error: "/login", // Error code passed in query string as ?error=
  },
  session: { strategy: "jwt" },
  cookies: {
    sessionToken: {
      name: `${VERCEL_DEPLOYMENT ? "__Secure-" : ""}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        // When working on localhost, the cookie domain must be omitted entirely (https://stackoverflow.com/a/1188145)
        domain: VERCEL_DEPLOYMENT
          ? `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`
          : undefined,
        secure: VERCEL_DEPLOYMENT,
      },
    },
  },
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
        username: user.username,
      },
    }),
    authorized({ request: req, auth }) {
      const path = req.nextUrl.pathname;
      const hostname = getHostname(req);
      if (hostname == `app.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) {
        const session = auth.user;
        if (!session && path !== "/login") {
          return NextResponse.redirect(new URL("/login", req.url));
        }

        return NextResponse.rewrite(new URL(`/app${path}`, req.url));
      }
      return;
    },
  },
} satisfies NextAuthConfig;
