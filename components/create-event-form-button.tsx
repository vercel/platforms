"use client";

import { useTransition } from "react";
import { createEventForm } from "@/lib/actions";
import { useParams, useRouter } from "next/navigation";
import va from "@vercel/analytics";
import CreateButton from "./primary-button";

export default function CreateEventFormButton() {
  const router = useRouter();
  const { subdomain, path } = useParams() as {
    subdomain: string;
    path: string;
  };
  const [isPending, startTransition] = useTransition();

  return (
    <CreateButton
      onClick={() =>
        startTransition(async () => {
          const form = await createEventForm(
            null,
            { params: { subdomain, path } },
            null,
          );
          va.track("Created Form");
          router.refresh();
          router.push(`/city/${subdomain}/events/${form.event.id}/forms/${form.id}`);
        })
      }
      loading={isPending}
    >
      <p>Create New Form</p>
    </CreateButton>
  );
}
