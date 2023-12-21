"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { kickAction } from "@/lib/actions";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { useState } from "react";
import LoadingDots from "@/components/icons/loading-dots";

interface OrgTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function OrgTableRowActions<TData>({
  row,
}: OrgTableRowActionsProps<TData>) {
  const data = row.id;
  const name = row.getValue("name") as unknown as string;
  const email = row.getValue("email") as unknown as string;

  const { subdomain } = useParams() as { subdomain: string };
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  /*
  To activate the Dialog component from within a Context Menu or Dropdown Menu,
  you must encase the Context Menu or Dropdown Menu component in the Dialog component.
  For more information, refer to the linked issue here.
  https://github.com/radix-ui/primitives/issues/1836
  */
  return (
    //
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted flex h-8 w-8 p-0"
          >
            <DotsHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          {/* <DropdownMenuItem>Edit</DropdownMenuItem>
        <DropdownMenuItem>Make a copy</DropdownMenuItem>
        <DropdownMenuItem>Favorite</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Labels</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup value={"sub action"}>
              {[{ label: "sub action", value: "sub action" }].map((label) => (
                <DropdownMenuRadioItem key={label.value} value={label.value}>
                  {label.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub> */}
          <DropdownMenuSeparator />
          <DialogTrigger asChild>
            <DropdownMenuItem>
              Remove
              <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Remove {email} from {subdomain}
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to remove {name}?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="submit"
            variant={"destructive"}
            onClick={async () => {
              try {
                setLoading(true);
                await kickAction({ email, subdomain });
                toast(`Succesfully removed ${email}`);
                router.refresh();
              } catch (error) {
                console.error(error);
              } finally {
                setLoading(false);
              }
            }}
          >
            {loading ? <LoadingDots /> : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
