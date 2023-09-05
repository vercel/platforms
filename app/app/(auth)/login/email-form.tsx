"use client";
import { FormHTMLAttributes, DetailedHTMLProps } from "react";
import LoadingDots from "@/components/icons/loading-dots";

interface EmailFormProps
  extends DetailedHTMLProps<
    FormHTMLAttributes<HTMLFormElement>,
    HTMLFormElement
  > {
  loading: boolean;
}

export default function EmailForm(props: EmailFormProps) {
  return (
    <form
      {...props}
      className="mb-8 mt-8 flex w-full max-w-md flex-col rounded p-1 px-6"
    >
      <label className="mb-1.5 font-mono text-xs font-semibold uppercase tracking-widest text-brand-gray400">
        Email
      </label>
      <input
        id="email"
        className="w-full rounded border border-brand-gray300/30 bg-transparent p-2 text-brand-gray200 outline-none ring-0 transition-all duration-300 placeholder:text-brand-gray400 hover:border-brand-primary/40 focus:border-brand-primary/50 focus:ring-brand-primary/50"
        placeholder="you@your.city"
        name="email"
        required
      />
      <button
        disabled={props.loading}
        type="submit"
        className="group mt-5 flex w-full items-center justify-center rounded border border-brand-gray300/30 p-2 px-4 font-semibold text-brand-gray200/80 transition-colors duration-200 hover:border-brand-primary/60 hover:text-brand-primary/60"
      >
        {props.loading ? (
          <div>
            <LoadingDots color="rgb(242 237 229)" />
          </div>
        ) : (
          "Continue with Email"
        )}
        {/* <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="inline-block h-6 w-6 align-text-top transition-all duration-200 group-hover:translate-x-[0.2rem] stroke-brand-gray300/30 group-hover:stroke-brand-primary/70"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg> */}
      </button>
    </form>
  );
}
