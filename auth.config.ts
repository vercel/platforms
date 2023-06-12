import type { NextAuthConfig } from "@auth/nextjs";
import GitHubProvider from "@auth/nextjs/providers/github";

const VERCEL_DEPLOYMENT = !!process.env.VERCEL_URL;

// @ts-ignore
declare module "@auth/nextjs/types" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      username: string;
      createdAt: Date;
    };
  }
}

export default {
  providers: [
    // @ts-ignore
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
      profile(profile) {
        console.log(profile);
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
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.id,
        username: token.username,
      },
    }),
  },
} satisfies NextAuthConfig;
