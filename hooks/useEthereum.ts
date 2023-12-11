import { ethers } from "ethers";
import CampaignContract from '@/protocol/campaigns/out/Campaign.sol/Campaign.json';
import { toast } from "sonner";
import { Campaign } from "@prisma/client";
import { launchCampaign } from "@/lib/actions";


interface LaunchCampaignData {
  id: string;
  sponsorEthAddress: string;
  deployedAddress: string;
  deployed: boolean;
}

interface Params {
  subdomain: string;
}

export default function useEthereum() {
  const connectToWallet = async (): Promise<ethers.Signer> => {
    if (!window.ethereum) {
      throw new Error("Please install MetaMask or another wallet.");
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    return provider.getSigner();
  };

  const launch = async (campaign: Campaign, params: Params): Promise<void> => {
    try {
      const signer = await connectToWallet();

      const campaignABI = CampaignContract.abi;
      const campaignBytecode = CampaignContract.bytecode;

      const creatorAddress = await signer.getAddress();
      const thresholdWei = campaign.thresholdWei;
      const name = campaign.name;

      const campaignFactory = new ethers.ContractFactory(campaignABI, campaignBytecode, signer);
      const campaignInstance = await campaignFactory.deploy(creatorAddress, thresholdWei, name);
      await campaignInstance.waitForDeployment();

      const deployedAddress = await campaignInstance.getAddress();

      const data: LaunchCampaignData = {
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

  const contribute = async (amount: string, campaign: Campaign): Promise<void> => {
    try {
      const signer = await connectToWallet();

      if (!campaign.deployed) {
        throw new Error("Campaign isn't deployed yet");
      }

      const campaignABI = CampaignContract.abi;
      const campaignInstance = new ethers.Contract(campaign.deployedAddress!, campaignABI, signer);
      await campaignInstance.contribute({ value: ethers.parseEther(amount) });

      toast.success(`Contributed ${amount} ETH`);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const withdraw = async (amount: string, campaign: Campaign): Promise<void> => {
    try {
      const signer = await connectToWallet();

      if (!campaign.deployed) {
        throw new Error("Campaign isn't deployed yet");
      }

      const campaignABI = CampaignContract.abi;
      const campaignInstance = new ethers.Contract(campaign.deployedAddress!, campaignABI, signer);
      await campaignInstance.withdraw(ethers.parseEther(amount));

      toast.success(`Withdrew ${amount} ETH`);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const getContributionTotal = async (contractAddr: string) => {
    const signer = await connectToWallet();

    const campaignABI = CampaignContract.abi;
    const campaignInstance = new ethers.Contract(contractAddr, campaignABI, signer);
    const total = await campaignInstance.totalContributions();
    return total;
  }

  const getContractBalance = async (contractAddr: string) => {
    try {
      if (!ethers.isAddress(contractAddr)) {
        throw new Error("Invalid contract address");
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const balance = await provider.getBalance(contractAddr);
      return balance;
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
      throw error;
    }
  }

  return {
    connectToWallet,
    launch,
    contribute,
    withdraw,
    getContributionTotal,
    getContractBalance,
  };
};