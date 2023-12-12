import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import CampaignPageContent from "@/components/campaign-page-content";

export default async function PublicCampaignPage({ params }: { params: { id: string } }) {

  const data = await prisma.campaign.findFirst({
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

  if (!data.deployed) {
    notFound();
  }

  return (
    <div className="px-24 py-12">
      <CampaignPageContent
        campaignId={params.id}
        subdomain={data.subdomain}
        isPublic={true}
      />
    </div>
  );
}