"use client";

import React from 'react';
import { Campaign } from "@prisma/client";
import { Button } from "./ui/button";
import useEthereum from "@/hooks/useEthereum";


interface LaunchCampaignButtonProps {
  campaign: Campaign;
  subdomain: string;
  onComplete: () => void;
}

export default function LaunchCampaignButton({ campaign, subdomain, onComplete }: LaunchCampaignButtonProps) {
  const { launch } = useEthereum();
  const onClick = async () => {
    launch(campaign, { subdomain }).then(onComplete);
  }
  return (
    <Button onClick={onClick}>
      Launch campaign
    </Button>
  );
}
