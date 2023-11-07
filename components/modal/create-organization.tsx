"use client";

import { toast } from "sonner";
import { createOrganization } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { experimental_useFormStatus as useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";
import LoadingDots from "@/components/icons/loading-dots";
import { useModal } from "./provider";
import va from "@vercel/analytics";
import { useEffect, useState } from "react";
import { Organization } from "@prisma/client";
import PrimaryButton from "../primary-button";
import FormButton from "./form-button";

export default function CreateOrganizationModal() {
  const router = useRouter();
  const modal = useModal();

  const [data, setData] = useState({
    name: "",
    subdomain: "",
    description: "",
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
        createOrganization(data).then((res: Organization | { error: string }) => {
          if ('error' in res && res.error) {
            toast.error(res.error);
          } else {
            va.track("Created City");
            const { id, subdomain } = res as Organization;
            router.refresh();
            router.push(`/city/${subdomain}`);
            modal?.hide();
            toast.success(`Successfully created City!`);
          }
        })
      }
      className="w-full rounded-md bg-gray-200/80 backdrop-blur-lg  dark:bg-gray-900/80 md:max-w-md md:border md:border-gray-200 md:shadow dark:md:border-gray-700"
    >
      <div className="relative flex flex-col space-y-4 p-5 md:p-10">
        <h2 className="font-cal text-2xl dark:text-gray-100">Create a new city</h2>

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="name"
            className="text-sm font-medium text-gray-500 dark:text-gray-400"
          >
            City Name
          </label>
          <input
            name="name"
            type="text"
            placeholder="My Awesome City"
            autoFocus
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
            maxLength={32}
            required
            className="w-full rounded-md border border-gray-700 bg-gray-200 px-4 py-2 text-sm text-gray-900 placeholder:text-gray-700 focus:border-gray-900 focus:outline-none focus:ring-gray-900 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-700 dark:focus:ring-gray-100"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="subdomain"
            className="text-sm font-medium text-gray-500"
          >
            Subdomain
          </label>
          <div className="flex w-full max-w-md">
            <input
              name="subdomain"
              type="text"
              placeholder="subdomain"
              value={data.subdomain}
              onChange={(e) => setData({ ...data, subdomain: e.target.value })}
              autoCapitalize="off"
              pattern="[a-zA-Z0-9\-]+" // only allow lowercase letters, numbers, and dashes
              maxLength={32}
              required
              className="w-full rounded-l-lg border border-gray-700 bg-gray-200 px-4 py-2 text-sm text-gray-900 placeholder:text-gray-700 focus:border-gray-900 focus:outline-none focus:ring-gray-900 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-700 dark:focus:ring-gray-100"
            />
            <div className="flex items-center rounded-r-lg border border-l-0 border-gray-700 font-medium text-gray-100 bg-gray-800 px-3 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400">
              .{process.env.NEXT_PUBLIC_ROOT_DOMAIN}
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="description"
            className="text-sm font-medium text-gray-500"
          >
            Description
          </label>
          <textarea
            name="description"
            placeholder="Description about why my city is so awesome"
            value={data.description}
            onChange={(e) => setData({ ...data, description: e.target.value })}
            maxLength={140}
            rows={3}
            className="w-full rounded-md border border-gray-700 bg-gray-200 px-4 py-2 text-sm text-gray-900 placeholder:text-gray-700 focus:border-gray-900  focus:outline-none focus:ring-gray-900 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-700 dark:focus:ring-gray-100"
          />
        </div>
      </div>
      <div className="flex items-center justify-end rounded-b-lg border-t border-gray-700 bg-gray-200 p-3 dark:border-gray-700 dark:bg-gray-800 md:px-10">
        <FormButton text={"Create Organization"} />
      </div>
    </form>
  );
}

