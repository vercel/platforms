"use client";
import { useState } from "react";

export default function Banner({ subdomain }: { subdomain: string }) {
  const [closeModal, setCloseModal] = useState<boolean>(false);

  if (subdomain !== "demo") {
    return null;
  }
  return (
    <div
      className={`${
        closeModal ? "h-14 lg:h-auto" : "lg:h-auto sm:h-40 h-60"
      } max-w-screen-xl xl:mx-auto mx-5 rounded-lg px-5 lg:pt-3 pt-0 pb-3 flex flex-col lg:flex-row space-y-3 lg:space-y-0 justify-between items-center sticky bottom-5 bg-white border-t-4 border-black
        drop-shadow-lg transition-all ease-in-out duration-150`}
    >
      <button
        onClick={() => setCloseModal(!closeModal)}
        className={`${
          closeModal ? "rotate-180" : "rotate-0"
        } lg:hidden absolute top-2 right-3 text-black transition-all ease-in-out duration-150`}
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
        <p className="font-title text-lg sm:text-2xl text-black">
          Platforms Starter Kit Demo
        </p>
        <p
          className={`${
            closeModal ? "lg:block hidden" : ""
          } text-sm text-gray-700 mt-2 lg:mt-0`}
        >
          This is a demo site showcasing how to build a multi-tenant application
          with{" "}
          <a
            className="text-black font-semibold underline"
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
          closeModal ? "lg:flex hidden" : ""
        } flex space-y-3 sm:space-y-0 sm:space-x-3 sm:flex-row flex-col lg:w-auto w-full text-center`}
      >
        <a
          className="flex-auto font-title text-lg rounded-md py-1 sm:py-3 px-5 text-black border border-gray-200 hover:border-black transition-all ease-in-out duration-150 whitespace-no-wrap"
          href="https://app.vercel.pub"
          rel="noreferrer"
          target="_blank"
        >
          Create your publication
        </a>
        <a
          className="flex-auto font-title text-lg bg-black text-white border border-black rounded-md py-1 sm:py-3 px-5 hover:text-black hover:bg-white transition-all ease-in-out duration-150 whitespace-no-wrap"
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
