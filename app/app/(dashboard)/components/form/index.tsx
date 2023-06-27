"use client";

import LoadingDots from "@/components/app/loading-dots";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { experimental_useFormStatus as useFormStatus } from "react-dom";
import { toast } from "sonner";
import DomainStatus from "./domain-status";
import DomainConfiguration from "./domain-configuration";
import Uploader from "./uploader";

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
  const { id } = useParams() as { id?: string };
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
        handleSubmit(data, id, inputAttrs.name)
          .then(async () => {
            toast.success(`Successfully updated ${inputAttrs.name}!`);
            if (id) {
              router.refresh();
            } else {
              await update();
              router.refresh();
            }
          })
          .catch((err: Error) => toast.error(err.message));
      }}
      className="rounded-lg border border-stone-200 bg-white"
    >
      <div className="relative flex flex-col space-y-4 p-5 sm:p-10">
        <h2 className="text-xl font-cal">{title}</h2>
        <p className="text-sm text-stone-500">{description}</p>
        {inputAttrs.name === "image" ? (
          <Uploader defaultValue={inputAttrs.defaultValue} />
        ) : inputAttrs.name === "subdomain" ? (
          <div className="w-full max-w-md flex">
            <input
              {...inputAttrs}
              required
              className="border border-stone-300 text-stone-900 placeholder-stone-300 z-10 focus:border-stone-500 focus:outline-none focus:ring-stone-500 rounded-l-md text-sm flex-1"
            />
            <div className="text-sm flex items-center px-3 bg-stone-100 rounded-r-md border border-l-0 border-stone-300">
              {process.env.NEXT_PUBLIC_ROOT_DOMAIN}
            </div>
          </div>
        ) : inputAttrs.name === "customDomain" ? (
          <div className="relative w-full max-w-md flex">
            <input
              {...inputAttrs}
              className="border border-stone-300 text-stone-900 placeholder-stone-300 z-10 focus:border-stone-500 focus:outline-none focus:ring-stone-500 rounded-md text-sm flex-1"
            />
            {inputAttrs.defaultValue && (
              <DomainStatus domain={inputAttrs.defaultValue} />
            )}
          </div>
        ) : inputAttrs.name === "description" ? (
          <textarea
            {...inputAttrs}
            rows={3}
            required
            className="w-full max-w-xl rounded-md border border-stone-300 text-sm text-stone-900 placeholder-stone-300 focus:border-stone-500 focus:outline-none focus:ring-stone-500"
          />
        ) : (
          <input
            {...inputAttrs}
            required
            className="w-full max-w-md rounded-md border border-stone-300 text-sm text-stone-900 placeholder-stone-300 focus:border-stone-500 focus:outline-none focus:ring-stone-500"
          />
        )}
      </div>
      {inputAttrs.name === "customDomain" && inputAttrs.defaultValue && (
        <DomainConfiguration domain={inputAttrs.defaultValue} />
      )}
      <div className="flex items-center justify-between rounded-b-lg border-t border-stone-200 bg-stone-50 p-3 sm:px-10">
        <p className="text-sm text-stone-500">{helpText}</p>
        <FormButton />
      </div>
    </form>
  );
}

function FormButton() {
  const { pending } = useFormStatus();
  return (
    <button
      className={clsx(
        "flex h-10 w-32 items-center justify-center space-x-2 rounded-md border text-sm transition-all focus:outline-none",
        pending
          ? "cursor-not-allowed border-stone-200 bg-stone-100 text-stone-400"
          : "border-black bg-black text-white hover:bg-white hover:text-black"
      )}
      disabled={pending}
    >
      {pending ? <LoadingDots color="#808080" /> : <p>Save Changes</p>}
    </button>
  );
}
