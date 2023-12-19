"use client";

import useEthereum from "@/hooks/useEthereum";
import { Campaign, CampaignTier } from "@prisma/client";
import { useState, useEffect } from 'react';
import { ethers } from "ethers";
import { getCampaign, updateCampaign } from "@/lib/actions";
import LoadingDots from "@/components/icons/loading-dots";
import { Button } from "@/components/ui/button";
import CampaignContributeButton from "@/components/campaign-contribute-button";
import CampaignTierCard from "@/components/campaign-tier-card";
import { Progress } from "@/components/ui/progress"
import { useRouter } from "next/navigation";
import Link from "next/link";


export default function CampaignPublicView(
  {campaignId, subdomain}:
  {campaignId: string, subdomain: string, isPublic: boolean}
) {
  const { getContributionTotal, getContractBalance } = useEthereum();
  const [totalContributions, setTotalContributions] = useState(BigInt(0));
  const [contractBalance, setContractBalance] = useState(BigInt(0));
  const [campaign, setCampaign] = useState<Campaign | undefined>(undefined);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [loading, setLoading] = useState(true);

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
        <div className="flex space-x-16">
          <div className="flex-grow 0 flex-basis 2/3">
            <div className="space-y-4">
              <h1 className="text-2xl font-bold mb-6">{campaign.name}</h1>
              <div>
                Hosted by
                <Link href={`/`} className="font-bold">
                  {` ${campaign.organization.name}`}
                </Link>
              </div>
              <div className="mb-6 flex flex-col space-y-4">
                <div className="flex space-x-8">
                </div>
              </div>
              <p>{campaign.content}</p>
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
            </div>
          </div>
          <div className="flex-grow 0 flex-basis 1/3">
            <CampaignContributeButton
              campaign={campaign}
              subdomain={subdomain}
              onComplete={triggerRefresh}
              className={"p-4 border border-gray-500 rounded-md"}
            />
          </div>
        </div>
      )}
    </div>
  );
}