"use client";

import { useTransition } from "react";
import { createForm } from "@/lib/actions";
import { useParams, useRouter } from "next/navigation";
import va from "@vercel/analytics";
import CreateButton from "./primary-button";

export default function CreateFormButton() {
  const router = useRouter();
  const { subdomain } = useParams() as {
    subdomain: string;
  };
  const [isPending, startTransition] = useTransition();

  return (
    <CreateButton
      onClick={() =>
        startTransition(async () => {
          const form = await createForm(
            null,
            { params: { subdomain } },
            null,
          );
          va.track("Created Form");
          router.push(`/city/${subdomain}/forms/${form.id}`);
          router.refresh();
        })
      }
      loading={isPending}
    >
      <p>Create New Form</p>
    </CreateButton>
  );
}
