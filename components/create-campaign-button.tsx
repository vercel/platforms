"use client";

import { useTransition } from "react";
import { createCampaign } from "@/lib/actions";
import { useParams, useRouter } from "next/navigation";
import va from "@vercel/analytics";
import CreateButton from "./primary-button";
import { track } from "@/lib/analytics";

export default function CreateCampaignButton() {
  const router = useRouter();
  const { subdomain } = useParams() as {
    subdomain: string;
  };
  const [isPending, startTransition] = useTransition();

  return (
    <CreateButton
      onClick={() =>
        startTransition(async () => {
          const campaign = await createCampaign(
            null,
            { params: { subdomain } },
            null,
          );
          router.push(`/city/${subdomain}/campaigns/${campaign.id}/settings`);
          router.refresh();
        })
      }
      loading={isPending}
    >
      <p>New Campaign</p>
    </CreateButton>
  );
}