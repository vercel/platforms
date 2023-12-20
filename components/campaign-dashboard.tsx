"use client";

import LaunchCampaignButton from "@/components/launch-campaign-button";
import CampaignWithdrawButton from "@/components/campaign-withdraw-button";
import CampaignTierCard from "@/components/campaign-tier-card";
import useEthereum from "@/hooks/useEthereum";
import { Campaign, CampaignTier } from "@prisma/client";
import { useState, useEffect } from 'react';
import { ethers } from "ethers";
import { CampaignWithData, getCampaign, updateCampaign } from "@/lib/actions";
import LoadingDots from "@/components/icons/loading-dots";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress"
import { useRouter } from "next/navigation";



export default function CampaignDashboard(
  {campaignId, subdomain}:
  {campaignId: string, subdomain: string, isPublic: boolean}
) {
  const { getContributionTotal, getContractBalance } = useEthereum();
  const [totalContributions, setTotalContributions] = useState(BigInt(0));
  const [contractBalance, setContractBalance] = useState(BigInt(0));
  const [campaign, setCampaign] = useState<CampaignWithData | undefined>(undefined);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deadline, setDeadline] = useState(undefined);

  const router = useRouter();

  const numBackers = 12;  // TEMP

  const triggerRefresh = () => {
    setRefreshFlag(prev => !prev);
  };

  useEffect(() => {
    getCampaign(campaignId).then(result => {
      if (result) {
        setCampaign(result);
      }
    }).then(() => setLoading(false));
  }, [refreshFlag, campaignId]);

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

  if (loading) {
    return <LoadingDots color="#808080" />
  }
  else if (!campaign || !campaign.organizationId) {
    return <div>Campaign not found</div>
  }

  const getProgress = (contributions: bigint, thresholdWei: bigint) => {
    if (contributions < thresholdWei) {
      return Number(contributions * BigInt(100) / thresholdWei);
    } else {
      return 100;
    }
  }

  return (
    <div>
      {loading ? (
        <LoadingDots color="#808080" />
      ) : !campaign || !campaign.organizationId ? (
        <div>Campaign not found</div>
      ) : (
        <div>
          <div className="space-y-4 my-4">
            <h1 className="text-2xl font-bold my-6">{campaign.name}</h1>
            <div className="mb-6 flex flex-col space-y-4">
              <div className="flex justify-between space-x-4">
                <Progress
                  value={getProgress(totalContributions, campaign.thresholdWei)}
                  className="h-6 w-[80%]"
                />
                <Button
                    onClick={() => router.push(`/city/${subdomain}/campaigns/${campaignId}/settings`)}
                  >
                  Edit
                </Button>
              </div>
              <div className="flex space-x-8">
                <p className="text-sm">
                  {`${ethers.formatEther(totalContributions)} of ${ethers.formatEther(campaign.thresholdWei)} ETH funded`}
                </p>
                <p className="text-sm">
                  {`${numBackers} backers`}
                </p>
                <p className="text-sm">
                  {`${ethers.formatEther(contractBalance)} ETH available`}
                </p>
              </div>
            </div>
            <p>{campaign.content}</p>
            {campaign.deadline && 
              <div className="flex space-x-4 items-center">
                {`Deadline: ${campaign.deadline.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric'})}`}
              </div>
            }
            <div className="my=2">
              {campaign.requireApproval ? "Requires approval" : "Anyone can contribute"}
            </div>
            <div className="my-2">
              {campaign.deployed
              ? `Launched ${campaign.timeDeployed!.toLocaleString(undefined, {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: undefined,
                timeZoneName: undefined
              })}`
              : "Not launched yet"}
            </div>
          </div>
          <div>
            {campaign?.form?.name}
          </div>
          {campaign.campaignTiers &&
            <div>
              <h2 className="text-xl">Campaign Tiers</h2>
              {campaign.campaignTiers.map((tier: CampaignTier, index: number) =>
                <CampaignTierCard
                  key={index}
                  tier={tier}
                />
              )}
            </div>
          }
          <div className="mt-4">
            {!campaign.deployed &&
              <LaunchCampaignButton
                campaign={campaign}
                subdomain={subdomain}
                onComplete={triggerRefresh}
              />
            }
          </div>
        </div>
      )}
    </div>
  );
}