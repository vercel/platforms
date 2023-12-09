"use client";

import React from 'react';
import { Campaign } from "@prisma/client";
import { Button } from "./ui/button";
import useEthereum from "@/hooks/useEthereum";


interface LaunchCampaignButtonProps {
  campaign: Campaign;
  subdomain: string;
}

export default function LaunchCampaignButton({ campaign, subdomain }: LaunchCampaignButtonProps) {
  const { launch } = useEthereum();
  return (
    <Button onClick={() => launch(campaign, { subdomain })}>
      Launch campaign
    </Button>
  );
}
