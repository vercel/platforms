import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import AnalyticsMockup from "../../../components/analytics";

export default async function SiteAnalytics({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }
  const data = await prisma.site.findFirst({
    where: {
      id: params.id,
      userId: session.user.id as string,
    },
  });
  if (!data) {
    notFound();
  }

  const url = `${data.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;

  return (
    <>
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h1 className="font-cal text-3xl font-bold">
            Analytics for {data.name}
          </h1>
          <a
            href={`https://${url}`}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium px-2 py-1 rounded-md bg-stone-100 text-stone-600 hover:bg-stone-200 transition-colors truncate"
          >
            {url} ↗
          </a>
        </div>
      </div>
      <AnalyticsMockup />
    </>
  );
}
