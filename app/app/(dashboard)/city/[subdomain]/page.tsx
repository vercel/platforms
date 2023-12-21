import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
// import Posts from "@/components/posts";
// import CreatePostButton from "@/components/create-post-button";
// import CityOverviewStats from "@/components/city-overview-stats";
import CityDashboardKPIs from "@/components/analytics/city-dashboard-kpis";
import PageHeader from "@/components/dashboard-header";

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
      <div className="flex flex-col">
        <PageHeader title="Overview" ActionButton={null} />
        <CityDashboardKPIs org={data} />
      </div>
    </div>
  );
}
