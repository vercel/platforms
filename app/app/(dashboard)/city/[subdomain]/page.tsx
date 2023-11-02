import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Posts from "@/components/posts";
// import CreatePostButton from "@/components/create-post-button";
import CityOverviewStats from "@/components/city-overview-stats";

export default async function SitePosts({
  params,
}: {
  params: { subdomain: string };
}) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  const data = await prisma.organization.findUnique({
    where: {
      // id: params.id,
      subdomain: params.subdomain,
    },
  });

  if (!data) {
    notFound();
  }

  const url = `${data.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
        <div className="col-span-1 flex flex-col space-y-6">
          <h1 className="font-serif text-3xl font-light dark:text-white">
            Overview
          </h1>
          <CityOverviewStats />
        </div>
      </div>
      <div className="flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
        <div className="col-span-1 flex flex-col space-y-6">
          <h1 className="font-serif text-3xl font-light dark:text-white">
            Last edited
          </h1>
          <Posts organizationId={data.id} />
        </div>
      </div>
    </div>
  );
}
