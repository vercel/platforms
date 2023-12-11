"use client";

import LaunchCampaignButton from "@/components/launch-campaign-button";
import CampaignContributeButton from "@/components/campaign-contribute-button";
import CampaignWithdrawButton from "@/components/campaign-withdraw-button";
import CampaignForm from "@/components/edit-campaign-form";
import useEthereum from "@/hooks/useEthereum";
import { Campaign } from "@prisma/client";
import { useState, useEffect } from 'react';
import { ethers } from "ethers";
import { getCampaign } from "@/lib/actions";


export default function CampaignPageContent(
  {campaignId, subdomain}: {campaignId: string, subdomain: string}
) {
  const { getContributionTotal, getContractBalance } = useEthereum();
  const [totalContributions, setTotalContributions] = useState(0);
  const [contractBalance, setContractBalance] = useState(BigInt(0));
  const [campaign, setCampaign] = useState<Campaign | undefined>(undefined);

  useEffect(() => {
    getCampaign(campaignId).then(result => {
      if (result) {
        setCampaign(result);
      }
    });
  }, [campaignId]);

  useEffect(() => {
    async function fetchTotalContributions() {
      if (campaign?.deployed) {
        const total = await getContributionTotal(campaign.deployedAddress!);
        setTotalContributions(total);
      }
    }
    fetchTotalContributions();

    async function fetchContractBalance() {
      if (campaign?.deployed) {
        const balance = await getContractBalance(campaign.deployedAddress!);
        setContractBalance(balance);
      }
    }
    fetchContractBalance();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaign]);


  if (!campaign || !campaign.organizationId) {
    return <div>Campaign not found</div>
  }

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold">
          {campaign.name}
        </h1>
        <p>
          {`threshold: ${ethers.formatEther(campaign.thresholdWei)} ETH`}
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
          ? `Deployed ${campaign.timeDeployed!.toLocaleString(undefined, {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: undefined,
            timeZoneName: undefined
          })}`
          : "Not deployed"}
        </p>
        {totalContributions &&
          <p>
            {`Raised so far: ${ethers.formatEther(totalContributions)} ETH`}
          </p>
        }
        {campaign.deployed &&
          <p>
            {`Contract balance: ${ethers.formatEther(contractBalance)} ETH`}
          </p>
        }
      </div>
      <CampaignForm id={campaign.id} subdomain={subdomain} />
      {!campaign.deployed &&
            <LaunchCampaignButton campaign={campaign} subdomain={subdomain} />
      }
      {campaign.deployed && (
        <CampaignContributeButton
          campaign={campaign}
          subdomain={subdomain}
        />
      )}
      {campaign.deployed && (
        <CampaignWithdrawButton
          campaign={campaign}
          subdomain={subdomain}
        />
      )}
    </div>
  );
}