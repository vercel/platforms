"use client";

import { useModal } from "@/components/modal/provider";
import { ReactNode } from "react";

export default function CreateSiteButton({
  children,
}: {
  children: ReactNode;
}) {
  const modal = useModal();
  return (
    <button
      onClick={() => modal?.show(children)}
      className="font-medium text-sm px-3 py-1.5 rounded-lg border border-stone-300 hover:border-black text-stone-500 hover:text-black active:bg-stone-100 transition-all"
    >
      Create New Site
    </button>
  );
}
