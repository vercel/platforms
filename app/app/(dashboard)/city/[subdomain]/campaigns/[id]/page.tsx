import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import notFound from "../../not-found";
import LaunchCampaignButton from "@/components/launch-campaign-button";
import CampaignContributeButton from "@/components/campaign-contribute-button";
import CampaignForm from "@/components/edit-campaign-form";
import { ethers } from "ethers";
import { toast } from "sonner";
import CampaignContract from '@/protocol/campaigns/out/Campaign.sol/Campaign.json';
import { Campaign } from "@prisma/client";
import { launchCampaign } from "@/lib/actions";
import useEthereum from "@/hooks/useEthereum";


export default async function CampaignPage({
  params,
}: {
  params: { path: string; subdomain: string; id: string };
}) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const { getContributionTotal } = useEthereum();

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

  let totalContributions;
  if (campaign.deployed) {
    totalContributions = await getContributionTotal(campaign.deployedAddress);
  }

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold">
          {campaign.name}
        </h1>
        <p>
          {`threshold: ${campaign.threshold} ETH`}
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
          {`last updated ${campaign.updatedAt.toLocaleString(undefined, {
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
          {campaign.deployed
          ? `Deployed ${campaign.timeDeployed.toLocaleString(undefined, {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: undefined,
            timeZoneName: undefined
          })} at ${campaign.deployedAddress} by ${campaign.sponsorEthAddress}`
          : "Not deployed"}
        </p>
        <p>
          {`Raised so far: ${campaign.contributions} ETH`}
        </p>
      </div>
      <CampaignForm id={params.id} subdomain={params.subdomain} />
      {!campaign.deployed &&
            <LaunchCampaignButton campaign={campaign} subdomain={params.subdomain} />
      }
      {campaign.deployed && (
        <CampaignContributeButton
          campaign={campaign}
          subdomain={params.subdomain}
        />
      )}
    </div>
  );
}