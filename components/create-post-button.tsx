"use client";

import { useTransition } from "react";
import { createPost } from "@/lib/actions";
import clsx from "clsx";
import { useParams, useRouter } from "next/navigation";
import LoadingDots from "@/components/icons/loading-dots";

export default function CreatePostButton() {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() =>
        startTransition(async () => {
          const post = await createPost(null, id, null);
          router.refresh();
          router.push(`/post/${post.id}`);
        })
      }
      className={clsx(
        "flex h-8 w-36 items-center justify-center space-x-2 rounded-lg border text-sm transition-all focus:outline-none sm:h-9",
        isPending
          ? "cursor-not-allowed border-stone-200 bg-stone-100 text-stone-400"
          : "border border-black bg-black text-white hover:bg-white hover:text-black active:bg-stone-100",
      )}
      disabled={isPending}
    >
      {isPending ? <LoadingDots color="#808080" /> : <p>Create New Post</p>}
    </button>
  );
}
