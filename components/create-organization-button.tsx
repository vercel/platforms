"use client";

import { useModal } from "@/components/modal/provider";
import { ReactNode } from "react";

export default function CreateOrganizationButton({
  children,
}: {
  children: ReactNode;
}) {
  const modal = useModal();
  return (
    <button
      onClick={() => modal?.show(children)}
      className="rounded-lg border border-black bg-black px-4 py-1.5 text-sm font-medium text-white transition-all hover:bg-white hover:text-black active:bg-brand-gray100 dark:border-brand-gray700 dark:hover:border-brand-gray200 dark:hover:bg-black dark:hover:text-white dark:active:bg-brand-gray800"
    >
      Create New City
    </button>
  );
}
