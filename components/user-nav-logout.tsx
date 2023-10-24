"use client";
import {
  DropdownMenuItem,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";
export default function UserNavLogout() {
  return <DropdownMenuItem onClick={() => signOut()}>
    Sign out
    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
  </DropdownMenuItem>;
}
