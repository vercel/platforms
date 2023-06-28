"use client";

import { toast } from "sonner";
import { createSite } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { experimental_useFormStatus as useFormStatus } from "react-dom";
import clsx from "clsx";
import LoadingDots from "@/components/icons/loading-dots";
import { useModal } from "./provider";

export default function CreateSiteModal() {
  const router = useRouter();
  const modal = useModal();
  return (
    <form
      action={async (data: FormData) =>
        createSite(data)
          .then((site) => {
            toast.success(`Successfully created site!`);
            const { id } = site;
            router.push(`/site/${id}`);
            modal?.hide();
          })
          .catch((err: Error) => toast.error(err.message))
      }
      className="bg-white rounded-md md:border md:border-stone-200 md:shadow w-full md:max-w-md"
    >
      <div className="relative flex flex-col space-y-4 p-5 md:p-10">
        <h2 className="text-2xl font-cal">Create a new site</h2>

        <div className="flex flex-col space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-stone-500">
            Site Name
          </label>
          <input
            name="name"
            type="text"
            placeholder="My Awesome Site"
            maxLength={32}
            required
            className="rounded-md text-sm border border-stone-200 bg-stone-50 text-stone-600 placeholder:text-stone-400 px-4 py-2 w-full focus:outline-none  focus:border-black focus:ring-black"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="subdomain"
            className="text-sm font-medium text-stone-500"
          >
            Subdomain
          </label>
          <div className="w-full max-w-md flex">
            <input
              name="subdomain"
              type="text"
              placeholder="subdomain"
              pattern="[a-zA-Z0-9\-]+" // only allow lowercase letters, numbers, and dashes
              maxLength={32}
              required
              className="rounded-l-lg text-sm border border-stone-200 bg-stone-50 text-stone-600 placeholder:text-stone-400 px-4 py-2 w-full focus:outline-none  focus:border-black focus:ring-black"
            />
            <div className="text-sm flex items-center px-3 bg-stone-100 rounded-r-lg border border-l-0 border-stone-200">
              {process.env.NEXT_PUBLIC_ROOT_DOMAIN}
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="description"
            className="text-sm font-medium text-stone-500"
          >
            Description
          </label>
          <textarea
            name="description"
            placeholder="Description about why my site is so awesome"
            maxLength={140}
            rows={3}
            className="rounded-md text-sm border border-stone-200 bg-stone-50 text-stone-600 placeholder:text-stone-400 px-4 py-2 w-full focus:outline-none  focus:border-black focus:ring-black"
          />
        </div>
      </div>
      <div className="flex items-center justify-end rounded-b-lg border-t border-stone-200 bg-stone-50 p-3 md:px-10">
        <CreateSiteFormButton />
      </div>
    </form>
  );
}
function CreateSiteFormButton() {
  const { pending } = useFormStatus();
  return (
    <button
      className={clsx(
        "flex h-10 w-full items-center justify-center space-x-2 rounded-md border text-sm transition-all focus:outline-none",
        pending
          ? "cursor-not-allowed border-stone-200 bg-stone-100 text-stone-400"
          : "border-black bg-black text-white hover:bg-white hover:text-black"
      )}
      disabled={pending}
    >
      {pending ? <LoadingDots color="#808080" /> : <p>Create Site</p>}
    </button>
  );
}
