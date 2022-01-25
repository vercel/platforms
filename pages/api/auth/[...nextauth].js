import NextAuth from "next-auth";
import TwitterProvider from "next-auth/providers/twitter";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";

export const authOptions = {
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
      session.user.id = user.id;
      session.user.username = user.username;
      return session;
    },
  },
};

export default NextAuth(authOptions);
