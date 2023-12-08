import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import notFound from "../../not-found";
import LaunchCampaignButton from "@/components/launch-campaign-button";
import CampaignForm from "@/components/edit-campaign-form";


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
          ? "Deployed"
          : "Not deployed"}
        </p>
        <p>
          {campaign.timeDeployed
          ? `Deployed ${campaign.timeDeployed.toLocaleString(undefined, {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: undefined,
            timeZoneName: undefined
          })}`
          : "No deployment time known"}
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
        {/* <p>
          {`organization: ${campaign.organization.name}`}
        </p> */}
      </div>
      <CampaignForm id={params.id} subdomain={params.subdomain} />
      <LaunchCampaignButton campaign={campaign} subdomain={params.subdomain} />
    </div>
  );
}