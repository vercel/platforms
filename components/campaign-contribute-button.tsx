"use client";

import { Campaign } from "@prisma/client";
import { Button } from "./ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from 'react';
import useEthereum from "@/hooks/useEthereum";


interface CampaignContributeButtonProps {
  campaign: Campaign;
  subdomain: string;
  onComplete: () => void;
}

export default function CampaignContributeButton({ 
  campaign, 
  subdomain,
  onComplete
}: CampaignContributeButtonProps) {
  const { contribute } = useEthereum();
  const [amount, setAmount] = useState('');

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
    <div className="flex items-center space-x-4 my-4">
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
        className={`${isValidAmount() ? 'hover:bg-gray-700' : 'bg-gray-500'}`}
      >
        Contribute
      </Button>
    </div>
  );
}