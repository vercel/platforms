import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Posts from "@/components/posts";
import CreatePostButton from "@/components/create-post-button";

export default async function SitePosts({
  params,
}: {
  params: { id: string };
}) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  const data = await prisma.site.findUnique({
    where: {
      id: params.id,
    },
  });

  if (!data || data.userId !== session.user.id) {
    notFound();
  }

  const url = `${data.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;

  return (
    <>
      <div className="flex justify-between items-center flex-col sm:flex-row space-y-4 sm:space-y-0">
        <div className="flex items-center flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          <h1 className="font-cal text-xl sm:text-3xl font-bold w-60 truncate sm:w-auto">
            All Posts for {data.name}
          </h1>
          <a
            href={
              process.env.NEXT_PUBLIC_VERCEL_ENV
                ? `https://${url}`
                : `http://${data.subdomain}.localhost:3000`
            }
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium px-2 py-1 rounded-md bg-stone-100 text-stone-600 hover:bg-stone-200 transition-colors truncate"
          >
            {url} ↗
          </a>
        </div>
        <CreatePostButton />
      </div>
      <Posts siteId={params.id} />
    </>
  );
}
