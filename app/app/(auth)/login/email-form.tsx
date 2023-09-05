"use client"
import { FormHTMLAttributes, DetailedHTMLProps } from "react";

export default function EmailForm(props: DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>) {
  return (
    <form {...props} className="mt-8 mb-8 px-6 w-full max-w-md flex flex-col rounded p-1">
        <label className="text-brand-gray400 font-semibold text-xs tracking-widest mb-1.5 font-mono uppercase">Email</label>
        <input
          id='email'
          className="bg-transparent w-full rounded p-2 border text-brand-gray200 placeholder:text-brand-gray400 border-brand-gray300/30 hover:border-brand-primary/40 focus:border-brand-primary/50 transition-all duration-300 outline-none focus:ring-brand-primary/50 ring-0"
          placeholder="you@your.city"
          name="email"
          required
        />
        <button
          type="submit"
          className="mt-5 w-full border hover:border-brand-primary/60 hover:text-brand-primary/60 text-brand-gray200/80 border-brand-gray300/30 group flex justify-center items-center rounded p-2 px-4 font-semibold transition-colors duration-200"
        >
          Continue with Email
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
