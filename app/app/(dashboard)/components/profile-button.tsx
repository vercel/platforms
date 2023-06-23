"use client";

import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import Image from "next/image";

export default function ProfileButton({ session }: { session: Session }) {
  return (
    <button
      onClick={() => signOut()}
      className="flex items-center space-x-3 w-full hover:bg-stone-200 active:bg-stone-300 rounded-lg px-2 py-1.5 transition-all ease-in-out duration-150"
    >
      <Image
        src={
          session.user.image ?? `https://avatar.vercel.sh/${session.user.email}`
        }
        width={40}
        height={40}
        alt={session.user.name ?? "User avatar"}
        className="h-6 w-6 rounded-full"
      />
      <span className="font-medium text-sm truncate">{session.user.name}</span>
    </button>
  );
}
