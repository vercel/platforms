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
      className="rounded-lg border border-brand-gray800 bg-brand-gray800 px-4 py-1.5 text-sm font-medium text-brand-gray100 transition-all hover:bg-brand-gray100 hover:text-brand-gray800 active:bg-brand-gray100 dark:border-brand-gray700 dark:hover:border-brand-gray200 dark:hover:bg-brand-gray800 dark:hover:text-brand-gray100 dark:active:bg-brand-gray800"
    >
      {text}
    </button>
  );
}
