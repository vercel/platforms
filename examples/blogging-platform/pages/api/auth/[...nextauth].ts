import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from '../../../lib/prisma'

export default NextAuth({
  providers: [
    Providers.Email({
        server: process.env.EMAIL_SERVER,
        from: process.env.EMAIL_FROM,
    }),
    Providers.GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
        }
      },
    }),
    Providers.Twitter({
      clientId: process.env.TWITTER_ID,
      clientSecret: process.env.TWITTER_SECRET,
    })
  ],
  database: process.env.DATABASE_URL,
  secret: process.env.SECRET,
  pages: {
    signIn: `/login`,
    verifyRequest: `/login`,
  },
  adapter: PrismaAdapter(prisma),
  callbacks: {
    session: (session, user) => {
        session.user.id = user.id
        return session
    },
    jwt: (token, session) => {
      if (session) {
        token.id = session.id
      }
      return token
    }
  },
  session: {
    jwt: true,
  }
})