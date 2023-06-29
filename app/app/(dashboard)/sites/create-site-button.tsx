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
      className="font-medium text-sm px-4 py-1.5 rounded-lg border border-black bg-black hover:bg-white text-white hover:text-black active:bg-stone-100 transition-all"
    >
      Create New Site
    </button>
  );
}
