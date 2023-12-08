import React from 'react';
import { Campaign } from "@prisma/client";
import { Button } from "./ui/button";

interface LaunchCampaignButtonProps {
  campaign: Campaign;
  subdomain: string;
  onLaunch: (campaign: Campaign) => Promise<void>;
}

export default function LaunchCampaignButton({ campaign, subdomain, onLaunch }: LaunchCampaignButtonProps) {
  return (
    <Button onClick={() => onLaunch(campaign)}>
      Launch campaign
    </Button>
  );
}
