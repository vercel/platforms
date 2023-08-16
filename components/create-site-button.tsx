"use client";

import { ReactNode } from "react";

import { useModal } from "@/components/modal/provider";

export default function CreateSiteButton({
  children,
}: {
  children: ReactNode;
}) {
  const modal = useModal();
  return (
    <button
      className="rounded-lg border border-black bg-black px-4 py-1.5 text-sm font-medium text-white transition-all hover:bg-white hover:text-black active:bg-stone-100 dark:border-stone-700 dark:hover:border-stone-200 dark:hover:bg-black dark:hover:text-white dark:active:bg-stone-800"
      onClick={() => modal?.show(children)}
    >
      Create New Site
    </button>
  );
}
