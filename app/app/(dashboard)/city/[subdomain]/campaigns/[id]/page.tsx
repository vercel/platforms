import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import notFound from "../../not-found";
import { Input } from "@/components/ui/input";
import LaunchCampaignButton from "@/components/launch-campaign-button";
import { toast } from "@/components/ui/use-toast";
import { UpdateCampaignSchema } from "@/lib/schema";
import { updateCampaign } from "@/lib/actions";
import { zodResolver } from "@hookform/resolvers/zod";
import CampaignForm from "@/components/create-campaign-form";
import { Campaign } from "@prisma/client";


export default async function CampaignPage({
  params,
}: {
  params: { path: string; subdomain: string; id: string };
}) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const campaign = await prisma.campaign.findUnique({
    where: {
      id: params.id,
    },
    include: {
      organization: true,
      contributions: true,
    },
  });

  if (!campaign || !campaign.organization) {
    return notFound();
  }

  return (
    <div>
      <div>
        <p>
          {campaign.name}
        </p>
        <p>
          {`threshold: ${campaign.threshold}`}
        </p>
        <p>
          {`content: ${campaign.content}`}
        </p>
        <p>
          {`created ${campaign.createdAt.toLocaleString(undefined, {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: undefined,
            timeZoneName: undefined
          })}`}
        </p>
        <p>
          {`last update ${campaign.updatedAt.toLocaleString(undefined, {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: undefined,
            timeZoneName: undefined
          })}`}
        </p>
        <p>
          {`deployed: ${campaign.deployed}`}
        </p>
        <p>
          {`timeDeployed: ${campaign.timeDeployed}`}
        </p>
        <p>
          {`deployedAddress: ${campaign.deployedAddress}`}
        </p>
        <p>
          {`sponsorEthAddress: ${campaign.sponsorEthAddress}`}
        </p>
        <p>
          {`contributions: ${campaign.contributions}`}
        </p>
        <p>
          {`organization: ${campaign.organization.name}`}
        </p>
      </div>
      <CampaignForm id={params.id} subdomain={params.subdomain} />
      <LaunchCampaignButton campaign={campaign} subdomain={params.subdomain} />
    </div>
  );
}