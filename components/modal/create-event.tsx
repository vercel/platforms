"use client";

import { toast } from "sonner";
import { createEvent } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { experimental_useFormStatus as useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";
import LoadingDots from "@/components/icons/loading-dots";
import { useModal } from "./provider";
import va from "@vercel/analytics";
import { useEffect, useState } from "react";
import { Organization } from "@prisma/client";

export default function CreateEventModal({
  organization,
}: {
  organization: Organization;
}) {
  const router = useRouter();
  const modal = useModal();

  const [data, setData] = useState({
    name: "",
    description: "",
    path: "",
  });

  useEffect(() => {
    setData((prev) => ({
      ...prev,
      path: prev.name
        .toLowerCase()
        .trim()
        .replace(/[\W_]+/g, "-"),
    }));
  }, [data.name]);

  return (
    <form
      action={async (data: FormData) =>
        createEvent({
          name: data.get("name") as string,
          description: data.get("description") as string,
          path: data.get("path") as string,
          organizationId: organization.id,
        }).then((res: any) => {
          if (res.error) {
            toast.error(res.error);
          } else {
            va.track("Created Site");
            const { path } = res;
            router.refresh();
            router.push(`/city/${organization.subdomain}/events/${path}`);
            modal?.hide();
            toast.success(`Successfully created City!`);
          }
        })
      }
      className="w-full rounded-md bg-white dark:bg-brand-gray900 md:max-w-md md:border md:border-brand-gray200 md:shadow dark:md:border-brand-gray700"
    >
      <div className="relative flex flex-col space-y-4 p-5 m.d:p-10">
        <h2 className="font-cal text-2xl dark:text-white">
          Create a new event
        </h2>

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="name"
            className="text-brand-gray500 text-sm font-medium dark:text-brand-gray400"
          >
            Event Name
          </label>
          <input
            name="name"
            type="text"
            placeholder="My Awesome Event"
            autoFocus
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
            maxLength={32}
            required
            className="w-full rounded-md border border-brand-gray200 bg-brand-gray50 px-4 py-2 text-sm text-brand-gray900 placeholder:text-brand-gray400 focus:border-brand-gray900 focus:outline-none focus:ring-brand-gray900 dark:border-brand-gray600 dark:bg-brand-gray900 dark:text-white dark:placeholder-brand-gray700 dark:focus:ring-white"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="path"
            className="text-sm font-medium text-brand-gray500"
          >
            SEO Optimized Path
          </label>
          <div className="flex w-full max-w-md">
            <div className="flex items-center rounded-r-lg border border-l-0 border-brand-gray200 bg-brand-gray100 px-3 text-sm dark:border-brand-gray600 dark:bg-brand-gray800 dark:text-brand-gray400">
              {organization.subdomain}.{process.env.NEXT_PUBLIC_ROOT_DOMAIN}/
            </div>
            <input
              name="path"
              type="text"
              placeholder="path"
              value={data.path}
              onChange={(e) => setData({ ...data, path: e.target.value })}
              autoCapitalize="off"
              pattern="[a-zA-Z0-9\-]+" // only allow lowercase letters, numbers, and dashes
              maxLength={32}
              required
              className="w-full rounded-l-lg border border-brand-gray200 bg-brand-gray50 px-4 py-2 text-sm text-brand-gray900 placeholder:text-brand-gray400 focus:border-brand-gray900 focus:outline-none focus:ring-brand-gray900 dark:border-brand-gray600 dark:bg-brand-gray900 dark:text-white dark:placeholder-brand-gray700 dark:focus:ring-white"
            />
          </div>
        </div>

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
            className="w-full rounded-md border border-brand-gray200 bg-brand-gray50 px-4 py-2 text-sm text-brand-gray900 placeholder:text-brand-gray400 focus:border-brand-gray900  focus:outline-none focus:ring-brand-gray900 dark:border-brand-gray600 dark:bg-brand-gray900 dark:text-white dark:placeholder-brand-gray700 dark:focus:ring-white"
          />
        </div>
      </div>
      <div className="flex items-center justify-end rounded-b-lg border-t border-brand-gray200 bg-brand-gray50 p-3 dark:border-brand-gray700 dark:bg-brand-gray800 md:px-10">
        <CreateEventFormButton />
      </div>
    </form>
  );
}
function CreateEventFormButton() {
  const { pending } = useFormStatus();
  return (
    <button
      className={cn(
        "flex h-10 w-full items-center justify-center space-x-2 rounded-md border text-sm transition-all focus:outline-none",
        pending
          ? "cursor-not-allowed border-brand-gray200 bg-brand-gray100 text-brand-gray400 dark:border-brand-gray700 dark:bg-brand-gray800 dark:text-brand-gray300"
          : "border-brand-gray900 bg-brand-gray900 text-white hover:bg-white hover:text-brand-gray900 dark:border-brand-gray700 dark:hover:border-brand-gray200 dark:hover:bg-brand-gray900 dark:hover:text-white dark:active:bg-brand-gray800",
      )}
      disabled={pending}
    >
      {pending ? <LoadingDots color="#808080" /> : <p>Create Event</p>}
    </button>
  );
}
