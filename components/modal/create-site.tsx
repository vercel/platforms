"use client";

import va from "@vercel/analytics";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { experimental_useFormStatus as useFormStatus } from "react-dom";
import { toast } from "sonner";

import LoadingDots from "@/components/icons/loading-dots";
import { createSite } from "@/lib/actions";
import { cn } from "@/lib/utils";

import { useModal } from "./provider";

export default function CreateSiteModal() {
  const router = useRouter();
  const modal = useModal();

  const [data, setData] = useState({
    description: "",
    name: "",
    subdomain: "",
  });

  useEffect(() => {
    setData((prev) => ({
      ...prev,
      subdomain: prev.name
        .toLowerCase()
        .trim()
        .replace(/[\W_]+/g, "-"),
    }));
  }, [data.name]);

  return (
    <form
      action={async (data: FormData) =>
        createSite(data).then((res: any) => {
          if (res.error) {
            toast.error(res.error);
          } else {
            va.track("Created Site");
            const { id } = res;
            router.refresh();
            router.push(`/site/${id}`);
            modal?.hide();
            toast.success(`Successfully created site!`);
          }
        })
      }
      className="w-full rounded-md bg-white dark:bg-black md:max-w-md md:border md:border-stone-200 md:shadow dark:md:border-stone-700"
    >
      <div className="relative flex flex-col space-y-4 p-5 md:p-10">
        <h2 className="font-cal text-2xl dark:text-white">Create a new site</h2>

        <div className="flex flex-col space-y-2">
          <label
            className="text-sm font-medium text-stone-500 dark:text-stone-400"
            htmlFor="name"
          >
            Site Name
          </label>
          <input
            autoFocus
            className="w-full rounded-md border border-stone-200 bg-stone-50 px-4 py-2 text-sm text-stone-600 placeholder:text-stone-400 focus:border-black focus:outline-none focus:ring-black dark:border-stone-600 dark:bg-black dark:text-white dark:placeholder:text-stone-700 dark:focus:ring-white"
            maxLength={32}
            name="name"
            onChange={(e) => setData({ ...data, name: e.target.value })}
            placeholder="My Awesome Site"
            required
            type="text"
            value={data.name}
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label
            className="text-sm font-medium text-stone-500"
            htmlFor="subdomain"
          >
            Subdomain
          </label>
          <div className="flex w-full max-w-md">
            <input
              autoCapitalize="off"
              className="w-full rounded-l-lg border border-stone-200 bg-stone-50 px-4 py-2 text-sm text-stone-600 placeholder:text-stone-400 focus:border-black focus:outline-none focus:ring-black dark:border-stone-600 dark:bg-black dark:text-white dark:placeholder:text-stone-700 dark:focus:ring-white"
              maxLength={32}
              name="subdomain"
              onChange={(e) => setData({ ...data, subdomain: e.target.value })}
              pattern="[a-zA-Z0-9\-]+" // only allow lowercase letters, numbers, and dashes
              placeholder="subdomain"
              required
              type="text"
              value={data.subdomain}
            />
            <div className="flex items-center rounded-r-lg border border-l-0 border-stone-200 bg-stone-100 px-3 text-sm dark:border-stone-600 dark:bg-stone-800 dark:text-stone-400">
              .{process.env.NEXT_PUBLIC_ROOT_DOMAIN}
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-2">
          <label
            className="text-sm font-medium text-stone-500"
            htmlFor="description"
          >
            Description
          </label>
          <textarea
            className="w-full rounded-md border border-stone-200 bg-stone-50 px-4 py-2 text-sm text-stone-600 placeholder:text-stone-400 focus:border-black  focus:outline-none focus:ring-black dark:border-stone-600 dark:bg-black dark:text-white dark:placeholder:text-stone-700 dark:focus:ring-white"
            maxLength={140}
            name="description"
            onChange={(e) => setData({ ...data, description: e.target.value })}
            placeholder="Description about why my site is so awesome"
            rows={3}
            value={data.description}
          />
        </div>
      </div>
      <div className="flex items-center justify-end rounded-b-lg border-t border-stone-200 bg-stone-50 p-3 dark:border-stone-700 dark:bg-stone-800 md:px-10">
        <CreateSiteFormButton />
      </div>
    </form>
  );
}
function CreateSiteFormButton() {
  const { pending } = useFormStatus();
  return (
    <button
      className={cn(
        "flex h-10 w-full items-center justify-center space-x-2 rounded-md border text-sm transition-all focus:outline-none",
        pending
          ? "cursor-not-allowed border-stone-200 bg-stone-100 text-stone-400 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300"
          : "border-black bg-black text-white hover:bg-white hover:text-black dark:border-stone-700 dark:hover:border-stone-200 dark:hover:bg-black dark:hover:text-white dark:active:bg-stone-800",
      )}
      disabled={pending}
    >
      {pending ? <LoadingDots color="#808080" /> : <p>Create Site</p>}
    </button>
  );
}
