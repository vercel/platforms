import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import PostCard from "./post-card";
import Image from "next/image";
import db from "@/lib/db/db";
import { posts, sites, users } from "@/lib/db/schema";
import { eq, and, desc, getTableColumns } from "drizzle-orm";
import { withLimit } from "@/lib/utils";

export default async function Posts({
  siteId,
  limit,
}: {
  siteId?: string;
  limit?: number;
}) {
  const session = await getSession();
  if (!session?.user) {
    redirect("/login");
  }

  const query = db
    .select({ site: sites, ...getTableColumns(posts) })
    .from(posts)
    .leftJoin(sites, eq(posts.siteId, sites.id))
    .where(
      and(
        eq(posts.userId, session.user.id),
        siteId ? eq(sites.id, siteId) : undefined,
      ),
    )
    .orderBy(desc(posts.updatedAt));

  const postsResult = limit
    ? await withLimit(query.$dynamic(), limit)
    : await query;

  return postsResult.length > 0 ? (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {postsResult.map((post) => (
        <PostCard key={post.id} data={post} />
      ))}
    </div>
  ) : (
    <div className="flex flex-col items-center space-x-4">
      <h1 className="font-cal text-4xl">No Posts Yet</h1>
      <Image
        alt="missing post"
        src="https://illustrations.popsy.co/gray/graphic-design.svg"
        width={400}
        height={400}
      />
      <p className="text-lg text-stone-500">
        You do not have any posts yet. Create one to get started.
      </p>
    </div>
  );
}
