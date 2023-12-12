"use client";
import { FormHTMLAttributes, DetailedHTMLProps } from "react";
import LoadingDots from "@/components/icons/loading-dots";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import PrimaryButton from "../primary-button";
import { MailIcon } from "lucide-react";

interface EmailFormProps
  extends DetailedHTMLProps<
    FormHTMLAttributes<HTMLFormElement>,
    HTMLFormElement
  > {
  loading: boolean;
}

export default function EmailForm({ loading, ...props }: EmailFormProps) {
  return (
    <form
      {...props}
      className="mb-8 mt-4 flex w-full max-w-md flex-col rounded px-6 py-1"
    >
      {/* <Label className="mb-1.5 font-mono text-xs font-semibold uppercase tracking-widest text-gray-800 dark:text-gray-400">
        Email
      </Label> */}
      <Input
        id="email"
        className="w-full rounded border border-gray-800 bg-transparent p-2 text-gray-800 transition-all duration-200 placeholder:text-gray-700 hover:border-brand-primary/40 focus:border-brand-primary/50 focus:ring-brand-primary/50 dark:border-gray-300 placeholder:dark:text-gray-400"
        placeholder="you@your.city"
        name="email"
        required
      />
      <PrimaryButton
        disabled={loading}
        loading={loading}
        type="submit"
        className="group mt-5"
      >
        {loading ? (
          <div>
            <LoadingDots color="rgb(242 237 229)" />
          </div>
        ) : (
          <div className="flex items-center">
            <MailIcon width={16} />
            <span className="mx-2">{"Send magic link"}</span>
          </div>
        )}
        {/* <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="inline-block h-6 w-6 align-text-top transition-all duration-200 group-hover:translate-x-[0.2rem] stroke-gray-300/30 group-hover:stroke-brand-primary/70"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg> */}
      </PrimaryButton>
    </form>
  );
}
