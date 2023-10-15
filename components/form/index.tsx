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
  title: string;
  description: string;
  helpText: string;
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
  const { subdomain } = useParams() as { subdomain?: string };
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
        handleSubmit(data, subdomain, inputAttrs.name).then(async (res: any) => {
          if (res.error) {
            toast.error(res.error);
          } else {
            va.track(`Updated ${inputAttrs.name}`, subdomain ? { subdomain } : {});
            if (subdomain) {
              router.refresh();
            } else {
              await update();
              router.refresh();
            }
            toast.success(`Successfully updated ${inputAttrs.name}!`);
          }
        });
      }}
      className="rounded-lg border border-brand-gray200 bg-brand-gray50 dark:border-brand-gray700 dark:bg-brand-gray900"
    >
      <div className="relative flex flex-col space-y-4 p-5 sm:p-10">
        <h2 className="font-cal text-xl dark:text-white">{title}</h2>
        <p className="text-sm text-brand-gray500 dark:text-brand-gray400">
          {description}
        </p>
        {inputAttrs.name === "image" || inputAttrs.name === "logo" ? (
          <Uploader
            defaultValue={inputAttrs.defaultValue}
            name={inputAttrs.name}
          />
        ) : inputAttrs.name === "font" ? (
          <div className="flex max-w-sm items-center overflow-hidden rounded-lg border border-brand-gray600">
            <select
              name="font"
              defaultValue={inputAttrs.defaultValue}
              className="w-full rounded-none border-none bg-brand-gray50 px-4 py-2 text-sm font-medium text-brand-gray700 focus:outline-none focus:ring-black dark:bg-brand-gray900 dark:text-brand-gray200 dark:focus:ring-white"
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
              className="z-10 flex-1 rounded-l-md border border-brand-gray300 text-sm text-brand-gray900 placeholder-brand-gray400 focus:border-brand-gray500 focus:outline-none focus:ring-brand-gray500 dark:border-brand-gray600 dark:bg-brand-gray900 dark:text-white dark:placeholder-brand-gray700"
            />
            <div className="flex items-center rounded-r-md border border-l-0 border-brand-gray300 bg-brand-gray100 px-3 text-sm dark:border-brand-gray600 dark:bg-brand-gray800 dark:text-brand-gray400">
              {process.env.NEXT_PUBLIC_ROOT_DOMAIN}
            </div>
          </div>
        ) : inputAttrs.name === "customDomain" ? (
          <div className="relative flex w-full max-w-md">
            <input
              {...inputAttrs}
              className="z-10 flex-1 rounded-md border border-brand-gray300 text-sm text-brand-gray900 placeholder-brand-gray400 focus:border-brand-gray500 focus:outline-none focus:ring-brand-gray500 dark:border-brand-gray600 dark:bg-brand-gray900 dark:text-white dark:placeholder-brand-gray700"
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
            className="w-full max-w-xl rounded-md border border-brand-gray300 text-sm text-brand-gray900 placeholder-brand-gray400 focus:border-brand-gray500 focus:outline-none focus:ring-brand-gray500 dark:border-brand-gray600 dark:bg-brand-gray900 dark:text-white dark:placeholder-brand-gray700"
          />
        ) : (
          <input
            {...inputAttrs}
            required
            className="w-full max-w-md rounded-md border border-brand-gray300 text-sm text-brand-gray900 placeholder-brand-gray400 focus:border-brand-gray500 focus:outline-none focus:ring-brand-gray500 dark:border-brand-gray600 dark:bg-brand-gray900 dark:text-white dark:placeholder-brand-gray700"
          />
        )}
      </div>
      {inputAttrs.name === "customDomain" && inputAttrs.defaultValue && (
        <DomainConfiguration domain={inputAttrs.defaultValue} />
      )}
      <div className="flex flex-col items-center justify-center space-y-2 rounded-b-lg border-t border-brand-gray200 bg-brand-gray50 p-3 dark:border-brand-gray700 dark:bg-brand-gray800 sm:flex-row sm:justify-between sm:space-y-0 sm:px-10">
        <p className="text-sm text-brand-gray500 dark:text-brand-gray400">{helpText}</p>
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
          ? "cursor-not-allowed border-brand-gray200 bg-brand-gray100 text-brand-gray400 dark:border-brand-gray700 dark:bg-brand-gray800 dark:text-brand-gray300"
          : "border-black bg-brand-gray800 text-white hover:bg-brand-gray50 hover:text-black dark:border-brand-gray700 dark:hover:border-brand-gray200 dark:hover:bg-brand-gray800 dark:hover:text-white dark:active:bg-brand-gray800",
      )}
      disabled={pending}
    >
      {pending ? <LoadingDots color="#808080" /> : <p>Save Changes</p>}
    </button>
  );
}
