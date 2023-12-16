import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import CampaignPublicView from "@/components/campaign-public-view";
import { PathParamsContext } from "next/dist/shared/lib/hooks-client-context.shared-runtime";

export default async function PublicCampaignPage(
  { params }: { params: { id: string, subdomain: string } }
){
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

  // if (!data.deployed) {
  //   notFound();
  // }

  return (
    <div className="px-24 py-12">
      <CampaignPublicView
        campaignId={params.id}
        subdomain={params.subdomain}
        isPublic={true}
      />
    </div>
  );
}