import React from 'react';
import { CampaignTier } from "@prisma/client";

export default function CampaignTierCard({ tier }:
  { tier: CampaignTier })
{
  return (
    <div>
      <div className="space-y-4 my-4 rounded-md border border-gray-500 p-4">
        <h1 className="text-2xl font-bold">{tier.name}</h1>
        {tier.description && 
          <div className="mb-6 flex flex-col space-y-4">
            {tier.description}
          </div>
        }
        {tier.quantity && 
          <div className="flex space-x-4 items-center">
            {`${tier.quantity} total`}
          </div>
        }
        {tier.price && 
          <div className="flex space-x-4 items-center">
            {`${tier.price} ETH`}
          </div>
        }
      </div>
    </div>
  );
}