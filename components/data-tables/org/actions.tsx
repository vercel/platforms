"use client";

import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { CaretDownIcon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import { Event, Organization, Role, TicketTier, User } from "@prisma/client";
// import AddAttendeesModal from "../../modal/add-attendees";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useModal } from "../../modal/provider";
import InviteModal from "@/components/modal/invite";
import { Topics } from "@/components/topics";

interface EventTableActionsProps<TData> {
  table: Table<TData>;
  organization: Organization;
  roles: Role[];
}

export default function EventTableActions<TData>({
  table,
  roles,
  organization,
}: // users,
EventTableActionsProps<TData>) {
  const modal = useModal();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="ml-auto hidden h-8 lg:flex">
          Actions
          <CaretDownIcon className="ml-2 h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            // fetch(
            //   `/api/publish/${Topics["send-invite"]}`,
            //   {
            //     method: "POST",
            //     body: JSON.stringify({ myContent: "myContent" }),
            //   },
            // )
            //   .then((r) => r.json())
            //   .then(console.log);
            modal?.show(
              <InviteModal roles={roles} organization={organization} />,
            );
          }}
        >
          Send Invites
        </DropdownMenuItem>
        {/* {table
          .getAllColumns()
          .filter(
            (column) =>
              typeof column.accessorFn !== "undefined" && column.getCanHide(),
          )
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            );
          })} */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
