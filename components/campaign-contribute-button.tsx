"use client";

import { Campaign } from "@prisma/client";
import { Button } from "./ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from 'react';
import useEthereum from "@/hooks/useEthereum";
import { ethers } from "ethers";
import { useRouter } from "next/navigation";


interface CampaignContributeButtonProps {
  campaign: Campaign;
  subdomain: string;
  onComplete: () => void;
  className: string;
}

export default function CampaignContributeButton({ 
  campaign, 
  subdomain,
  onComplete,
  className
}: CampaignContributeButtonProps) {
  const { contribute } = useEthereum();
  const [amount, setAmount] = useState('');

  const router = useRouter();

  const isValidAmount = () => {
    const num = parseFloat(amount);
    return !isNaN(num) && num > 0;
  };

  const handleContribution = async () => {
    if (isValidAmount()) {
      contribute(amount, campaign).then(onComplete);
    }
  };

  return (
    <div className={`flex flex-col ${className}`}>
      <div>
        <div className="text-2xl">
          {ethers.formatEther(campaign.thresholdWei)} ETH
        </div>
        <div>
          Goal
        </div>
      </div>
      {campaign.requireApproval ? (
        <div className="mt-4">
          <Button
            onClick={() => router.push(`/forms/${campaign.form.id}`)}
            className="hover:bg-gray-700"
          >
            Apply to Join
          </Button>
        </div>
        ) : (
          <div className={"flex flex-col space-y-4 mt-4"}>
            <Input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount (ETH)"
              className="w-36"
            />
            <Button
              onClick={handleContribution}
              disabled={!isValidAmount()}
              className={`${isValidAmount() ? "hover:bg-gray-700" : "bg-gray-500"}`}
            >
              Fund
            </Button>
          </div>
        )
      }
    </div>
  );
}