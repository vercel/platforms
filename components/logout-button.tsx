"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut()}
      className="rounded-lg p-1.5 text-brand-gray700 transition-all duration-150 ease-in-out hover:bg-brand-gray200 active:bg-brand-gray300 dark:text-white dark:hover:bg-brand-gray700 dark:active:bg-brand-gray800"
    >
      <LogOut width={18} />
    </button>
  );
}
