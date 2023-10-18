"use client";

import { toast } from "sonner";
import { createEventRole } from "@/lib/actions";
import { useParams, useRouter } from "next/navigation";
import { experimental_useFormStatus as useFormStatus } from "react-dom";
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
              const { id, subdomain } = res as Organization;
              router.refresh();
              modal?.hide();
              toast.success(`Successfully created City!`);
            }
          },
        )
      }
      className="w-full rounded-md bg-brand-gray200/80 backdrop-blur-lg  dark:bg-brand-gray900/80 md:max-w-md md:border md:border-brand-gray200 md:shadow dark:md:border-brand-gray700"
    >
      <div className="relative flex flex-col space-y-4 p-5 md:p-10">
        <h2 className="font-cal text-2xl dark:text-brand-gray100">
          Create a new Role
        </h2>

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="name"
            className="text-brand-gray500 text-sm font-medium dark:text-brand-gray400"
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
            className="w-full rounded-md border border-brand-gray700 bg-brand-gray200 px-4 py-2 text-sm text-brand-gray900 placeholder:text-brand-gray700 focus:border-brand-gray900 focus:outline-none focus:ring-brand-gray900 dark:border-brand-gray600 dark:bg-brand-gray900 dark:text-brand-gray100 dark:placeholder-brand-gray700 dark:focus:ring-brand-gray100"
          />
        </div>

        {/* <div className="flex flex-col space-y-2">
          <label
            htmlFor="subdomain"
            className="text-brand-gray500 text-sm font-medium"
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
              className="w-full rounded-l-lg border border-brand-gray700 bg-brand-gray200 px-4 py-2 text-sm text-brand-gray900 placeholder:text-brand-gray700 focus:border-brand-gray900 focus:outline-none focus:ring-brand-gray900 dark:border-brand-gray600 dark:bg-brand-gray900 dark:text-brand-gray100 dark:placeholder-brand-gray700 dark:focus:ring-brand-gray100"
            />
            <div className="flex items-center rounded-r-lg border border-l-0 border-brand-gray700 bg-brand-gray800 px-3 text-sm font-medium text-brand-gray100 dark:border-brand-gray600 dark:bg-brand-gray800 dark:text-brand-gray400">
              .{process.env.NEXT_PUBLIC_ROOT_DOMAIN}
            </div>
          </div>
        </div> */}

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="description"
            className="text-brand-gray500 text-sm font-medium"
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
            className="w-full rounded-md border border-brand-gray700 bg-brand-gray200 px-4 py-2 text-sm text-brand-gray900 placeholder:text-brand-gray700 focus:border-brand-gray900  focus:outline-none focus:ring-brand-gray900 dark:border-brand-gray600 dark:bg-brand-gray900 dark:text-brand-gray100 dark:placeholder-brand-gray700 dark:focus:ring-brand-gray100"
          />
        </div>
      </div>
      <div className="flex items-center justify-end rounded-b-lg border-t border-brand-gray700 bg-brand-gray200 p-3 dark:border-brand-gray700 dark:bg-brand-gray800 md:px-10">
        <FormButton text={"Create Role"} />
      </div>
    </form>
  );
}
