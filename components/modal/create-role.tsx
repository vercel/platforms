"use client";

import { toast } from "sonner";
import { createEventRole } from "@/lib/actions";
import { useParams, useRouter } from "next/navigation";
import { useModal } from "./provider";
import va from "@vercel/analytics";
import { useState } from "react";
import { Organization, Role } from "@prisma/client";
import FormButton from "./form-button";

export default function CreateRoleModal() {
  const router = useRouter();
  const modal = useModal();
  const { subdomain, path } = useParams() as {
    subdomain: string;
    path: string;
  };

  const [data, setData] = useState({
    name: "",
    description: "",
  });

  return (
    <form
      action={async (data: FormData) =>
        createEventRole(data, { params: { subdomain, path } }, null).then(
          (res: Role | { error: string }) => {
            if ("error" in res && res.error) {
              toast.error(res.error);
            } else {
              va.track("Created Role");
              router.refresh();
              modal?.hide();
              toast.success(`Successfully created City!`);
            }
          },
        )
      }
      className="w-full rounded-md bg-gray-200/80 backdrop-blur-lg  dark:bg-gray-900/80 md:max-w-md md:border md:border-gray-200 md:shadow dark:md:border-gray-700"
    >
      <div className="relative flex flex-col space-y-4 p-5 md:p-10">
        <h2 className="font-cal text-2xl dark:text-gray-100">
          Create a new Role
        </h2>

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="name"
            className="text-gray-500 text-sm font-medium dark:text-gray-400"
          >
            Role Name
          </label>
          <input
            name="name"
            type="text"
            placeholder="Speaker"
            autoFocus
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
            maxLength={32}
            required
            className="w-full rounded-md border border-gray-700 bg-gray-200 px-4 py-2 text-sm text-gray-900 placeholder:text-gray-700 focus:border-gray-900 focus:outline-none focus:ring-gray-900 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-700 dark:focus:ring-gray-100"
          />
        </div>

        {/* <div className="flex flex-col space-y-2">
          <label
            htmlFor="subdomain"
            className="text-gray-500 text-sm font-medium"
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
            <div className="flex items-center rounded-r-lg border border-l-0 border-gray-700 bg-gray-800 px-3 text-sm font-medium text-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400">
              .{process.env.NEXT_PUBLIC_ROOT_DOMAIN}
            </div>
          </div>
        </div> */}

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="description"
            className="text-gray-500 text-sm font-medium"
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
        <FormButton text={"Create Role"} />
      </div>
    </form>
  );
}
