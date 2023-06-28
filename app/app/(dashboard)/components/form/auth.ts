import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import prisma from "@/lib/prisma";

export function withSiteAuth(action: any) {
  return async (
    formData: FormData | null,
    siteId: string,
    key: string | null
  ) => {
    const session = await getServerSession(authOptions);
    if (!session) {
      throw new Error("Not authenticated");
    }
    const site = await prisma.site.findUnique({
      where: {
        id: siteId,
      },
    });
    if (!site || site.userId !== session.user.id) {
      throw new Error("Not authorized");
    }

    return action(formData, site, key);
  };
}

export function withPostAuth(action: any) {
  return async (
    formData: FormData | null,
    postId: string,
    key: string | null
  ) => {
    const session = await getServerSession(authOptions);
    if (!session?.user.id) {
      throw new Error("Not authenticated");
    }
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });
    if (!post || post.userId !== session.user.id) {
      throw new Error("Post not found");
    }

    return action(formData, post, key);
  };
}
