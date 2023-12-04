"use client";

import { useModal } from "@/components/modal/provider";
import { ReactNode } from "react";

export default function OpenModalButton({
  children,
  text,
}: {
  children: ReactNode;
  text: string;
}) {
  const modal = useModal();
  return (
    <button
      onClick={() => modal?.show(children)}
      className="rounded-lg border border-gray-800 bg-gray-800 px-4 py-1.5 text-sm font-medium text-gray-100 transition-all hover:bg-gray-100 hover:text-gray-800 active:bg-gray-100 dark:border-gray-700 dark:hover:border-gray-200 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:active:bg-gray-800"
    >
      {text}
    </button>
  );
}
