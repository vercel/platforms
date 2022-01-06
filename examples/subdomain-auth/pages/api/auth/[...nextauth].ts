import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"

const useSecureCookies = !!process.env.VERCEL_URL

export default NextAuth({
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  secret: process.env.SECRET,
  cookies: {
    sessionToken: {
      name: `${useSecureCookies ? "__Secure-" : ""}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        domain: ".subdomain-auth.com",
        secure: useSecureCookies,
      },
    },
  },
})
