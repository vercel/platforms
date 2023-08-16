import Image from "next/image";
import { redirect } from "next/navigation";

import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

import PostCard from "./post-card";

export default async function Posts({
  limit,
  siteId,
}: {
  limit?: number;
  siteId?: string;
}) {
  const session = await getSession();
  if (!session?.user) {
    redirect("/login");
  }
  const posts = await prisma.post.findMany({
    include: {
      site: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
    where: {
      userId: session.user.id as string,
      ...(siteId ? { siteId } : {}),
    },
    ...(limit ? { take: limit } : {}),
  });

  return posts.length > 0 ? (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {posts.map((post) => (
        <PostCard data={post} key={post.id} />
      ))}
    </div>
  ) : (
    <div className="flex flex-col items-center space-x-4">
      <h1 className="font-cal text-4xl">No Posts Yet</h1>
      <Image
        alt="missing post"
        height={400}
        src="https://illustrations.popsy.co/gray/graphic-design.svg"
        width={400}
      />
      <p className="text-lg text-stone-500">
        You do not have any posts yet. Create one to get started.
      </p>
    </div>
  );
}
