"use client";

import { useState } from "react";

export default function CTA() {
  const [closeCTA, setCloseCTA] = useState(false);
  return (
    <div
      className={`${
        closeCTA ? "h-14 lg:h-auto" : "h-60 sm:h-40 lg:h-auto"
      } fixed inset-x-0 bottom-5 mx-5 flex max-w-screen-xl flex-col items-center justify-between space-y-3 rounded-lg border-t-4 border-black bg-white px-5 pb-3 pt-0 drop-shadow-lg transition-all duration-150 ease-in-out lg:flex-row lg:space-y-0 lg:pt-3 xl:mx-auto dark:border
          dark:border-t-4 dark:border-stone-700 dark:bg-black dark:text-white`}
    >
      <button
        onClick={() => setCloseCTA(!closeCTA)}
        className={`${
          closeCTA ? "rotate-180" : "rotate-0"
        } absolute right-3 top-2 text-black transition-all duration-150 ease-in-out lg:hidden dark:text-white`}
      >
        <svg
          viewBox="0 0 24 24"
          width="30"
          height="30"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          shapeRendering="geometricPrecision"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      <div className="text-center lg:text-left">
        <p className="font-title text-lg text-black sm:text-2xl dark:text-white">
          Platforms Starter Kit Demo
        </p>
        <p
          className={`${
            closeCTA ? "hidden lg:block" : ""
          } mt-2 text-sm text-stone-700 lg:mt-0 dark:text-stone-300`}
        >
          This is a demo site showcasing how to build a multi-tenant application
          with{" "}
          <a
            className="font-semibold text-black underline dark:text-white"
            href="https://platformize.co"
            rel="noreferrer"
            target="_blank"
          >
            custom domain
          </a>{" "}
          support.
        </p>
      </div>
      <div
        className={`${
          closeCTA ? "hidden lg:flex" : ""
        } flex w-full flex-col space-y-3 text-center sm:flex-row sm:space-x-3 sm:space-y-0 lg:w-auto`}
      >
        <a
          className="whitespace-no-wrap flex-auto rounded-md border border-stone-200 px-5 py-1 font-title text-lg text-black transition-all duration-150 ease-in-out hover:border-black sm:py-3 dark:border-stone-700 dark:text-white dark:hover:border-white"
          href="https://app.vercel.pub"
          rel="noreferrer"
          target="_blank"
        >
          Create your publication
        </a>
        <a
          className="whitespace-no-wrap flex-auto rounded-md border border-black bg-black px-5 py-1 font-title text-lg text-white transition-all duration-150 ease-in-out hover:bg-white hover:text-black sm:py-3 dark:border-white dark:bg-white dark:text-black dark:hover:bg-black dark:hover:text-white"
          href="https://vercel.com/guides/nextjs-multi-tenant-application"
          rel="noreferrer"
          target="_blank"
        >
          Clone and deploy
        </a>
      </div>
    </div>
  );
}
