"use client";

import { useTransition } from "react";
import { createPost } from "@/lib/actions";
import { useParams, useRouter } from "next/navigation";
import va from "@vercel/analytics";
import CreateButton from "./primary-button";

export default function CreatePostButton() {
  const router = useRouter();
  const { subdomain } = useParams() as { subdomain: string };
  const [isPending, startTransition] = useTransition();

  return (
    <CreateButton
      onClick={() =>
        startTransition(async () => {
          const post = await createPost(null, { params: { subdomain } }, null);
          va.track("Created Post");
          router.refresh();
          router.push(`/${subdomain}/docs/${post.id}`);
        })
      }
      loading={isPending}
    >
      <p>Create New Post</p>
    </CreateButton>
  );
}
