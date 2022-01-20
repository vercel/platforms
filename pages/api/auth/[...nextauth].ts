import NextAuth from "next-auth";
import TwitterProvider from "next-auth/providers/twitter";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";

if (!process.env.TWITTER_ID || !process.env.TWITTER_SECRET)
  throw new Error("Failed to initialize Twitter authentication");

export default NextAuth({
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_ID,
      clientSecret: process.env.TWITTER_SECRET,
      profile(profile) {
        return {
          id: profile.id_str,
          name: profile.name,
          username: profile.screen_name,
          email: profile.email && profile.email != "" ? profile.email : null,
          image: profile.profile_image_url_https.replace(
            /_normal\.(jpg|png|gif)$/,
            ".$1"
          ),
        };
      },
    }),
  ],
  secret: process.env.SECRET,
  pages: {
    signIn: `/login`,
    verifyRequest: `/login`,
  },
  adapter: PrismaAdapter(prisma),
  callbacks: {
    async session({ session, user }) {
      // TODO: Fix type errors
      // @ts-ignore
      session.user.id = user.id;
      // @ts-ignore
      session.user.username = user.username;
      return session;
    },
  },
});
