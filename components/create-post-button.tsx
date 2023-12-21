"use client";

import { useTransition } from "react";
import { createPost } from "@/lib/actions";
import { useParams, useRouter } from "next/navigation";
import CreateButton from "./buttons/primary-button";

export default function CreatePostButton() {
  const router = useRouter();
  const { subdomain } = useParams() as { subdomain: string };
  const [isPending, startTransition] = useTransition();

  return (
    <CreateButton
      onClick={() =>
        startTransition(async () => {
          const post = await createPost(null, { params: { subdomain } }, null);
          router.refresh();
          router.push(`/city/${subdomain}/docs/${post.id}`);
        })
      }
      loading={isPending}
    >
      <p>Create New Post</p>
    </CreateButton>
  );
}
