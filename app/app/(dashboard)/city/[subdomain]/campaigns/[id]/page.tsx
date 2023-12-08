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

  const launch = async (campaign: Campaign) => {
    try {
      if (!window.ethereum) {
        throw new Error("Please install MetaMask or another wallet.");
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();

      const campaignABI = CampaignContract.abi;
      const campaignBytecode = CampaignContract.bytecode;

      const creatorAddress = await signer.getAddress();
      const threshold = ethers.parseUnits(campaign.threshold.toString(), "ether");
      const name = campaign.name;

      const campaignFactory = new ethers.ContractFactory(campaignABI, campaignBytecode, signer);
      const campaignInstance = await campaignFactory.deploy(creatorAddress, threshold, name);
      await campaignInstance.waitForDeployment();
      const deployedAddress = await campaignInstance.getAddress();

      const data = {
        id: campaign.id,
        sponsorEthAddress: creatorAddress,
        deployedAddress: deployedAddress,
        deployed: true,
      };

      toast.success(`Campaign deployed at ${deployedAddress}`);

      await launchCampaign(data, { params: { subdomain: params.subdomain } }, null);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const contribute = async (amount: string, campaign: Campaign) => {
    try {
      if (!window.ethereum) {
        throw new Error("Please install MetaMask or another wallet.");
      }

      if (!campaign.deployed) {
        throw new Error("Campaign isn't deployed yet");
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();

      const campaignABI = CampaignContract.abi;
      const campaignInstance = new ethers.Contract(campaign.deployedAddress!, campaignABI, signer);
      await campaignInstance.contribute({ value: ethers.parseEther(amount) });

      toast.success(`Contributed ${amount} ETH`);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    }
  };

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
          {`contributions: ${campaign.contributions}`}
        </p>
      </div>
      <CampaignForm id={params.id} subdomain={params.subdomain} />
      {!campaign.deployed &&
            <LaunchCampaignButton campaign={campaign} subdomain={params.subdomain} onLaunch={launch} />
      }
      {campaign.deployed && (
        <CampaignContributeButton
          campaign={campaign}
          subdomain={params.subdomain}
          onContribute={contribute}
        />
      )}
    </div>
  );
}