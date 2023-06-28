"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut()}
      className="text-stone-700 hover:bg-stone-200 active:bg-stone-300 rounded-lg p-1.5 transition-all ease-in-out duration-150"
    >
      <LogOut width={18} />
    </button>
  );
}
