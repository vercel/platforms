"use client";

import { useTransition } from "react";
import { createCampaign } from "@/lib/actions";
import { useParams, useRouter } from "next/navigation";
import { ethers, Contract } from "ethers";
import CreateButton from "./primary-button";

export default function CreateCampaignButton() {
  const router = useRouter();
  const { subdomain } = useParams() as {
    subdomain: string;
  };
  const [isPending, startTransition] = useTransition();

  return (
    <CreateButton
    onClick={() => {
      startTransition(async () => {
        try {
          if (!window.ethereum) {
            throw new Error("Please install MetaMask or another wallet to create a campaign.");
          }
    
          const provider = new ethers.BrowserProvider(window.ethereum);
          await provider.send("eth_requestAccounts", []);
          const signer = await provider.getSigner();
    
          const campaignABI: string = '';
          const campaignBytecode = "/* ... Bytecode ... */";
    
          const creatorAddress = signer.address;
          const threshold = ethers.parseUnits("0", "ether");
          const name = "test";
    
          const campaignFactory = new ethers.ContractFactory(campaignABI, campaignBytecode, signer);
          const campaign = await campaignFactory.deploy(creatorAddress, threshold, name);
    
          await campaign.waitForDeployment();
          const deployedAddress = await campaign.getAddress();

          const data = {
            name: '',
            threshold: 0,
            creatorEthAddress: creatorAddress,
            deployedAddress: deployedAddress
          }
    
          createCampaign(data, { params: { subdomain } }, null)
            .then((campaignData) => {
              router.push(`/city/${subdomain}/campaigns/${campaignData.id}`);
              router.refresh();
            })
            .catch(console.error);
        } catch (error) {
          console.error(error);
        }
      });
    }}
      loading={isPending}
    >
      <p>New Campaign</p>
    </CreateButton>
  );
}
