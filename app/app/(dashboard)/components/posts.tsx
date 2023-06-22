import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { redirect, useParams } from "next/navigation";
import prisma from "@/lib/prisma";
import SiteCard from "./site-card";
import PostCard from "./post-card";

export default async function Posts({
  siteId,
  limit,
}: {
  siteId?: string;
  limit?: number;
}) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }
  const posts = await prisma.post.findMany({
    where: {
      userId: session.user.id as string,
      ...(siteId ? { siteId } : {}),
    },
    orderBy: {
      createdAt: "asc",
    },
    include: {
      site: true,
    },
    ...(limit ? { take: limit } : {}),
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {posts.map((post) => (
        <PostCard key={post.id} data={post} />
      ))}
    </div>
  );
}
