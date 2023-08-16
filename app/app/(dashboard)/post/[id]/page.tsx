import { notFound, redirect } from "next/navigation";

import Editor from "@/components/editor";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export default async function PostPage({ params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  const data = await prisma.post.findUnique({
    include: {
      site: {
        select: {
          subdomain: true,
        },
      },
    },
    where: {
      id: params.id,
    },
  });
  if (!data || data.userId !== session.user.id) {
    notFound();
  }

  return <Editor post={data} />;
}
