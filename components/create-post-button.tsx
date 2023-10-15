"use client";

import { useTransition } from "react";
import { createPost } from "@/lib/actions";
import { cn } from "@/lib/utils";
import { useParams, useRouter } from "next/navigation";
import LoadingDots from "@/components/icons/loading-dots";
import va from "@vercel/analytics";

export default function CreatePostButton() {
  const router = useRouter();
  const { subdomain } = useParams() as { subdomain: string };
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() =>
        startTransition(async () => {
          const post = await createPost(null, subdomain, null);
          va.track("Created Post");
          router.refresh();
          router.push(`${subdomain}/docs/${post.id}`);
        })
      }
      className={cn(
        "flex h-8 w-36 items-center justify-center space-x-2 rounded-lg border text-sm transition-all focus:outline-none sm:h-9",
        isPending
          ? "cursor-not-allowed border-brand-gray200 bg-brand-gray100 text-brand-gray400 dark:border-brand-gray700 dark:bg-brand-gray800 dark:text-brand-gray300"
          : "border border-brand-gray900 bg-brand-gray900 text-white hover:bg-white hover:text-brand-gray900 active:bg-brand-gray100 dark:border-brand-gray700 dark:hover:border-brand-gray200 dark:hover:bg-brand-gray900 dark:hover:text-white dark:active:bg-brand-gray800",
      )}
      disabled={isPending}
    >
      {isPending ? <LoadingDots color="#808080" /> : <p>Create New Post</p>}
    </button>
  );
}
