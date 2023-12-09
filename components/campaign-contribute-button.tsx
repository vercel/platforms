"use client";

import CampaignContract from '@/protocol/campaigns/out/Campaign.sol/Campaign.json';
import { ethers } from "ethers";
import { Campaign } from "@prisma/client";
import { Button } from "./ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import React, { useState } from 'react';
import useEthereum from "@/hooks/useEthereum";


interface CampaignContributeButtonProps {
  campaign: Campaign;
  subdomain: string;
}

export default function CampaignContributeButton({ 
  campaign, 
  subdomain
}: CampaignContributeButtonProps) {
  const { contribute } = useEthereum();
  const [amount, setAmount] = useState('');

  const isValidAmount = () => {
    const num = parseFloat(amount);
    return !isNaN(num) && num > 0;
  };

  const handleContribution = () => {
    if (isValidAmount()) {
      contribute(amount, campaign);
    }
  };

  return (
    <div>
      <Input
        type="text"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
      />
      <Button
        onClick={handleContribution}
        disabled={!isValidAmount()}
        className={`mt-2 ${isValidAmount() ? 'hover:bg-gray-700' : 'bg-gray-500'}`}
      >
        Contribute
      </Button>
    </div>
  );
}