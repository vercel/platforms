"use client";

import LoadingDots from "@/components/icons/loading-dots";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { experimental_useFormStatus as useFormStatus } from "react-dom";
import { toast } from "sonner";
import DomainStatus from "./domain-status";
import DomainConfiguration from "./domain-configuration";
import Uploader from "./uploader";
import va from "@vercel/analytics";

export default function Form({
  title,
  description,
  helpText,
  inputAttrs,
  handleSubmit,
}: {
  title?: string;
  description?: string;
  helpText?: string;
  inputAttrs: {
    name: string;
    type: string;
    defaultValue: string;
    placeholder?: string;
    maxLength?: number;
    pattern?: string;
  };
  handleSubmit: any;
}) {
  const params = useParams() as { subdomain?: string, path?: string };
  const router = useRouter();
  const { update } = useSession();
  return (
    <form
      action={async (data: FormData) => {
        if (
          inputAttrs.name === "customDomain" &&
          inputAttrs.defaultValue &&
          data.get("customDomain") !== inputAttrs.defaultValue &&
          !confirm("Are you sure you want to change your custom domain?")
        ) {
          return;
        }
        handleSubmit(data, {params}, inputAttrs.name).then(async (res: any) => {
          if (res.error) {
            toast.error(res.error);
          } else {
            va.track(`Updated ${inputAttrs.name}`, params.subdomain ? { subdomain: params.subdomain } : {});
            if (params.subdomain) {
              router.refresh();
            } else {
              await update();
              router.refresh();
            }
            toast.success(`Successfully updated ${inputAttrs.name}!`);
          }
        });
      }}
      className="rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900"
    >
      <div className="relative flex flex-col space-y-4 p-5 sm:p-10">
        <h2 className="font-cal text-xl dark:text-white">{title}</h2>
        <p className="text-sm text-gray-700 dark:text-gray-400">
          {description}
        </p>
        {inputAttrs.name === "image" || inputAttrs.name === "logo" ? (
          <Uploader
            defaultValue={inputAttrs.defaultValue}
            name={inputAttrs.name}
          />
        ) : inputAttrs.name === "font" ? (
          <div className="flex max-w-sm items-center overflow-hidden rounded-lg border border-gray-600">
            <select
              name="font"
              defaultValue={inputAttrs.defaultValue}
              className="w-full rounded-none border-none bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-black dark:bg-gray-900 dark:text-gray-200 dark:focus:ring-white"
            >
              <option value="font-cal">Cal Sans</option>
              <option value="font-lora">Lora</option>
              <option value="font-work">Work Sans</option>
            </select>
          </div>
        ) : inputAttrs.name === "subdomain" ? (
          <div className="flex w-full max-w-md">
            <input
              {...inputAttrs}
              required
              className="z-10 flex-1 rounded-l-md border border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-500 focus:outline-none focus:ring-gray-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:placeholder-gray-700"
            />
            <div className="flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-100 px-3 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400">
              {process.env.NEXT_PUBLIC_ROOT_DOMAIN}
            </div>
          </div>
        ) : inputAttrs.name === "customDomain" ? (
          <div className="relative flex w-full max-w-md">
            <input
              {...inputAttrs}
              className="z-10 flex-1 rounded-md border border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-500 focus:outline-none focus:ring-gray-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:placeholder-gray-700"
            />
            {inputAttrs.defaultValue && (
              <div className="absolute right-3 z-10 flex h-full items-center">
                <DomainStatus domain={inputAttrs.defaultValue} />
              </div>
            )}
          </div>
        ) : inputAttrs.name === "description" ? (
          <textarea
            {...inputAttrs}
            rows={3}
            required
            className="w-full max-w-xl rounded-md border border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-500 focus:outline-none focus:ring-gray-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:placeholder-gray-700"
          />
        ) : (
          <input
            {...inputAttrs}
            required
            className="w-full max-w-md rounded-md border border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-500 focus:outline-none focus:ring-gray-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:placeholder-gray-700"
          />
        )}
      </div>
      {inputAttrs.name === "customDomain" && inputAttrs.defaultValue && (
        <DomainConfiguration domain={inputAttrs.defaultValue} />
      )}
      <div className="flex flex-col items-center justify-center space-y-2 rounded-b-lg border-t border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800 sm:flex-row sm:justify-between sm:space-y-0 sm:px-10">
        <p className="text-sm text-gray-700 dark:text-gray-400">{helpText}</p>
        <FormButton />
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
          : "border-black bg-gray-800 text-white hover:bg-gray-50 hover:text-black dark:border-gray-700 dark:hover:border-gray-200 dark:hover:bg-gray-800 dark:hover:text-white dark:active:bg-gray-800",
      )}
      disabled={pending}
    >
      {pending ? <LoadingDots color="#808080" /> : <p>Save Changes</p>}
    </button>
  );
}
