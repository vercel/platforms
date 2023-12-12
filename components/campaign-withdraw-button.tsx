"use client";

import CampaignContract from '@/protocol/campaigns/out/Campaign.sol/Campaign.json';
import { ethers } from "ethers";
import { Campaign } from "@prisma/client";
import { Button } from "./ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import React, { useState } from 'react';
import useEthereum from "@/hooks/useEthereum";


interface CampaignWithdrawButtonProps {
  campaign: Campaign;
  subdomain: string;
  onComplete: () => void;
}

export default function CampaignWithdrawButton({ 
  campaign, 
  subdomain,
  onComplete
}: CampaignWithdrawButtonProps) {
  const { withdraw } = useEthereum();
  const [amount, setAmount] = useState('');

  const isValidAmount = () => {
    const num = parseFloat(amount);
    return !isNaN(num) && num > 0;
  };

  const handleWithdraw = () => {
    if (isValidAmount()) {
      withdraw(amount, campaign).then(onComplete);
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
        onClick={handleWithdraw}
        disabled={!isValidAmount()}
        className={`${isValidAmount() ? 'hover:bg-gray-700' : 'bg-gray-500'}`}
      >
        Withdraw
      </Button>
    </div>
  );
}