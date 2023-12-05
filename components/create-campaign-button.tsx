"use client";

import { useTransition } from "react";
import { createCampaign } from "@/lib/actions";
import { useParams, useRouter } from "next/navigation";
import CreateButton from "./primary-button";

export default function CreateCampaignButton() {
  const router = useRouter();
  const { subdomain } = useParams() as {
    subdomain: string;
  };
  const [isPending, startTransition] = useTransition();

  return (
    <CreateButton
      onClick={
        () => {
          // TODO create campaign on-chain
          startTransition(async () => {
            const data = {
              name: 'test',
              threshold: 0,
              creatorEthAddress: '',
            };
            createCampaign(data, { params: { subdomain } }, null)
              .then((campaign) => {
                router.push(`/city/${subdomain}/campaigns/${campaign.id}`);
                router.refresh();
              })
              .catch(console.error);
          });
        }
      }
      loading={isPending}
    >
      <p>New Form</p>
    </CreateButton>
  );
}
