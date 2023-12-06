// "use client";

import { useTransition } from "react";
import { createCampaign, updateCampaign, launchCampaign } from "@/lib/actions";
import { useParams, useRouter } from "next/navigation";
import { Campaign } from "@prisma/client";
import { ethers } from "ethers";
import CampaignEditor from "@/components/campaign-editor";
import { notFound } from "next/navigation";


export default async function CampaignEditorModal(
  props: { campaign: Campaign | undefined }
) {
  const router = useRouter();
  const { subdomain } = useParams() as {
    subdomain: string;
  };
  let newCampaign: Campaign;

  if (props.campaign === undefined) {
    // TODO will this need to be async?
    const initialData = {
      name: 'test name',
      threshold: 0,
    }
    newCampaign = await createCampaign(
      initialData, { params: { subdomain } }, null)
    .catch(console.error);
  }

  const data = await prisma.post.findUnique({
    where: {
      id: props.campaign ? props.campaign.id : newCampaign!.id
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

  if (!data.published) {
    notFound();
  }

  const onUpdate = async () => {
    updateCampaign(data, { params: { subdomain } }, null)
    .catch(console.error);
  };

  const deploy = async () => {
    onUpdate()
    .then(async () => {
      try {
        if (!window.ethereum) {
          throw new Error("Please install MetaMask or another wallet to create a campaign.");
        }

        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();

        const campaignABI: string = '';
        const campaignBytecode = "/* ... Bytecode ... */";

        // TODO make this actual data
        const creatorAddress = signer.address;
        const threshold = ethers.parseUnits("0", "ether");
        const name = "test";

        const campaignFactory = new ethers.ContractFactory(campaignABI, campaignBytecode, signer);
        const campaign = await campaignFactory.deploy(creatorAddress, threshold, name);
        await campaign.waitForDeployment();
        const deployedAddress = await campaign.getAddress();

        // TODO make this actual data
        const data = {
          name: '',
          threshold: 0,
          sponsorEthAddress: creatorAddress,
          deployedAddress: deployedAddress
        };

        launchCampaign(data, { params: { subdomain } }, null)
        .then((campaignData) => {
          router.push(`/city/${subdomain}/campaigns/${campaignData.id}`);
          router.refresh();
        })
      } catch (error) {
        console.error(error);
      }
    })
  };

  return <CampaignEditor post={data} />;
}