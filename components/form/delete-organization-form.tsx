"use client";

import LoadingDots from "@/components/icons/loading-dots";
import { cn } from "@/lib/utils";
import { useParams, useRouter } from "next/navigation";
import { experimental_useFormStatus as useFormStatus } from "react-dom";
import { toast } from "sonner";
import { deleteOrganization } from "@/lib/actions";
import { track } from "@/lib/analytics";

export default function DeleteOrganizationForm({
  organizationName,
}: {
  organizationName: string;
}) {
  const { subdomain } = useParams() as { subdomain: string };
  const router = useRouter();
  return (
    <form
      action={async (data: FormData) =>
        window.confirm("Are you sure you want to delete your city?") &&
        deleteOrganization(data, { params: { subdomain } }, "delete")
          .then(async (res) => {
            if (res.error) {
              toast.error(res.error);
            } else {
              router.refresh();
              router.push("/cities");
              toast.success(`Successfully deleted role!`);
            }
          })
          .catch((err: Error) => toast.error(err.message))
      }
      className="rounded-lg border border-red-600 bg-gray-50 dark:bg-gray-900"
    >
      <div className="relative flex flex-col space-y-4 p-5 sm:p-10">
        <h2 className="font-cal text-xl dark:text-gray-50">Delete City</h2>
        <p className="text-gray-500 text-sm dark:text-gray-400">
          Deletes your city and everything associated with it. Type in the name
          of your city <b>{organizationName}</b> to confirm.
        </p>

        <input
          name="confirm"
          type="text"
          required
          pattern={organizationName}
          placeholder={organizationName}
          className="focus:border-gray-500 focus:ring-gray-500 w-full max-w-md rounded-md border border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:outline-none dark:border-gray-600 dark:bg-gray-900 dark:text-gray-50 dark:placeholder-gray-700"
        />
      </div>

      <div className="flex flex-col items-center justify-center space-y-2 rounded-b-lg border-t border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800 sm:flex-row sm:justify-between sm:space-y-0 sm:px-10">
        <p className="text-gray-500 text-center text-sm dark:text-gray-400">
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
          ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          : "border-red-600 bg-red-600 text-gray-50 hover:bg-gray-50 hover:text-red-600 dark:hover:bg-transparent",
      )}
      disabled={pending}
    >
      {pending ? <LoadingDots color="#808080" /> : <p>Confirm Delete</p>}
    </button>
  );
}
