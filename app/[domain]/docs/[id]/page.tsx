import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Editor from "@/components/editor";

export default async function PostPage({ params }: { params: { id: string } }) {
  const session = await getSession();

  const data = await prisma.post.findUnique({
    where: {
      id: params.id,
    },
    include: {
      organization: {
        select: {
          subdomain: true,
        },
      },
    },
  });

  if (!data) {
    notFound();
  }

  if (!data.published) {
    notFound();
  }

  return <Editor post={data} />;
}
