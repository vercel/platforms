import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Editor from "@/components/editor";
import db from "@/lib/db/db";

export default async function PostPage({ params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const data = await db.query.posts.findFirst({
    where: (posts, { eq }) => eq(posts.id, decodeURIComponent(params.id)),
    with: {
      site: {
        columns: {
          subdomain:true
        }
      }
    }
  })
  if (!data || data.userId !== session.user.id) {
    notFound();
  }

  return <Editor post={data} />;
}
