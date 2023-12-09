"use client";

import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { CaretDownIcon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import { Event, TicketTier } from "@prisma/client";
import AddAttendeesModal from "../modal/add-attendees";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useModal } from "../modal/provider";

interface EventTableActionButtonProps<TData> {
  table: Table<TData>;
  ticketTiers: TicketTier[];
  event: Event;
}

export default function EventTableActionButton<TData>({
  table,
  ticketTiers,
  event,
}: EventTableActionButtonProps<TData>) {
  const modal = useModal();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="ml-auto hidden h-8 lg:flex"
        >
          Actions
          <CaretDownIcon className="ml-2 h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() =>
            modal?.show(
              <AddAttendeesModal ticketTiers={ticketTiers} event={event} />,
            )
          }
        >
          Add Attendees
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
