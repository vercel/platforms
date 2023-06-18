import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import SiteCard from "./site-card";

export default async function Sites({ limit }: { limit?: number }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }
  const sites = await prisma.site.findMany({
    where: {
      user: {
        id: session.user.id as string,
      },
    },
    orderBy: {
      createdAt: "asc",
    },
    ...(limit ? { take: limit } : {}),
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {sites.map((site) => (
        <SiteCard key={site.id} data={site} />
      ))}
    </div>
  );
}
