"use client";

import CampaignContract from '@/protocol/campaigns/out/Campaign.sol/Campaign.json';
import { ethers } from "ethers";
import { Campaign } from "@prisma/client";
import { Button } from "./ui/button";
import { toast } from "sonner";


export default function LaunchCampaignButton(
  props: { campaign: Campaign, subdomain: string }
) {
  const launch = async () => {
      try {
        if (!window.ethereum) {
          throw new Error("Please install MetaMask or another wallet to create a campaign.");
        }

        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();

        const campaignABI = CampaignContract.abi;
        const campaignBytecode = CampaignContract.bytecode;

        const creatorAddress = signer.address;
        const threshold = ethers.parseUnits(props.campaign.threshold.toString(), "ether");
        const name = props.campaign.name;

        const campaignFactory = new ethers.ContractFactory(campaignABI, campaignBytecode, signer);
        const campaignInstance = await campaignFactory.deploy(creatorAddress, threshold, name);
        await campaignInstance.waitForDeployment();
        const deployedAddress = await campaignInstance.getAddress();

        const data = {
          id: props.campaign.id,
          sponsorEthAddress: creatorAddress,
          deployedAddress: deployedAddress,
          // deployedAddress: creatorAddress,  // Debug,
          deployed: true,
        };

        toast.success(`Campaign deployed at ${deployedAddress}`);

        launchCampaign(data, { params: { subdomain: props.subdomain } }, null);
      } catch (error: any) {
        console.error(error);
        toast.error(error);
      }
  };

  return (
    <Button onClick={launch}>
      Launch campaign
    </Button>
  );
}