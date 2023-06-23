"use client";

import { useModal } from "@/app/modal/provider";
import { ReactNode } from "react";

export default function ModalButton({
  text,
  children,
}: {
  text: string;
  children: ReactNode;
}) {
  const modal = useModal();
  return (
    <button
      onClick={() => modal?.show(children)}
      className="font-medium text-sm px-3 py-1.5 rounded-lg border border-stone-300 hover:border-black text-stone-500 hover:text-black active:bg-stone-100 transition-all"
    >
      {text}
    </button>
  );
}
