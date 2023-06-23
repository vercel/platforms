import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import prisma from "@/lib/prisma";

export function withSiteAuth(action: any) {
  return async (formData: FormData, siteId: string, key: string) => {
    const session = await getServerSession(authOptions);
    if (!session) {
      throw new Error("Not authenticated");
    }
    const site = await prisma.site.findFirst({
      where: {
        id: siteId,
        userId: session.user.id,
      },
    });
    if (!site) {
      throw new Error("Not authorized");
    }

    return action(formData, site, key);
  };
}
