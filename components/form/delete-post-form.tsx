"use client";

import LoadingDots from "@/components/icons/loading-dots";
import { cn } from "@/lib/utils";
import { useParams, useRouter } from "next/navigation";
import { experimental_useFormStatus as useFormStatus } from "react-dom";
import { toast } from "sonner";
import { deletePost } from "@/lib/actions";
import va from "@vercel/analytics";

export default function DeletePostForm({ postName }: { postName: string }) {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  return (
    <form
      action={async (data: FormData) =>
        window.confirm("Are you sure you want to delete your post?") &&
        deletePost(data, id, "delete").then((res) => {
          if (res.error) {
            toast.error(res.error);
          } else {
            va.track("Deleted Post");
            router.refresh();
            router.push(`/city/${res.organizationId}`);
            toast.success(`Successfully deleted post!`);
          }
        })
      }
      className="rounded-lg border border-red-600 bg-white bg-brand-gray900"
    >
      <div className="relative flex flex-col space-y-4 p-5 sm:p-10">
        <h2 className="font-cal text-xl dark:text-white">Delete Post</h2>
        <p className="text-sm text-brand-gray500 dark:text-brand-gray400">
          Deletes your post permanently. Type in the name of your post{" "}
          <b>{postName}</b> to confirm.
        </p>

        <input
          name="confirm"
          type="text"
          required
          pattern={postName}
          placeholder={postName}
          className="w-full max-w-md rounded-md border border-brand-gray300 text-sm text-brand-gray900 placeholder-brand-gray300 focus:border-brand-gray500 focus:outline-none focus:ring-brand-gray500 dark:border-brand-gray600 bg-brand-gray900 dark:text-white dark:placeholder-brand-gray700"
        />
      </div>

      <div className="flex flex-col items-center justify-center space-y-2 rounded-b-lg border-t border-brand-gray200 bg-brand-gray50 p-3 dark:border-brand-gray700 dark:bg-brand-gray800 sm:flex-row sm:justify-between sm:space-y-0 sm:px-10">
        <p className="text-center text-sm text-brand-gray500 dark:text-brand-gray400">
          This action is irreversible. Please proceed with caution.
        </p>
        <div className="w-32">
          <FormButton />
        </div>
      </div>
    </form>
  );
}

function FormButton() {
  const { pending } = useFormStatus();
  return (
    <button
      className={cn(
        "flex h-8 w-32 items-center justify-center space-x-2 rounded-md border text-sm transition-all focus:outline-none sm:h-10",
        pending
          ? "cursor-not-allowed border-brand-gray200 bg-brand-gray100 text-brand-gray400 dark:border-brand-gray700 dark:bg-brand-gray800 dark:text-brand-gray300"
          : "border-red-600 bg-red-600 text-white hover:bg-white hover:text-red-600 dark:hover:bg-transparent",
      )}
      disabled={pending}
    >
      {pending ? <LoadingDots color="#808080" /> : <p>Confirm Delete</p>}
    </button>
  );
}
