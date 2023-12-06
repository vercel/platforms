"use client";
import { Ticket, User } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { shortenString } from "@/lib/profile";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "./data-table-column-header";
import { EventTableRowActions } from "./event-table-row-actions";

export const columns: ColumnDef<User>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    accessorKey: "tickets",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tickets" />
    ),
    cell: ({ row }) => {
      const tickets = row.getValue("tickets") as Array<
        Ticket & { tierName: string; tierPrice: number }
      >;

      return (
        <div className="flex flex-wrap space-x-1">
          {tickets.map((ticket) => {
            // const formattedPrice = new Intl.NumberFormat("en-US", {
            //   style: "currency",
            //   currency: "USD",
            // }).format(ticket.tierPrice);
            // const formattedAmountPaid = new Intl.NumberFormat("en-US", {
            //   style: "currency",
            //   currency: "USD",
            // }).format(ticket.amountPaid);
            return (
              <Badge key={ticket.id} variant="default">
                {`${ticket.tierName}`}
              </Badge>
            );
          })}
        </div>
      );
    },
    filterFn: (row, id, filterValues) => {
      //  console.log('rows: ', rows)
      const tickets = row.getValue("tickets") as Array<
        Ticket & { tierName: string; tierPrice: number }
      >;
      console.log("tickets: ", tickets);
      console.log("filterValues: ", filterValues);

      if (filterValues.length === 0) return true;

      return tickets.some((t) => filterValues.includes(t.tierName));
    },
  },
  {
    accessorKey: "eth_address",
    header: "Wallet",
    cell: ({ row }) => {
      const address = row.getValue("eth_address") as string;
      if (!address) {
        return null;
      }
      return (
        <div className="flex items-center">
          <a
            href={`https://etherscan.io/address/${address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline-offset-1 hover:underline"
          >
            <span>{shortenString(address, 6, 6)}</span>
            <span className="ml-1.5">↗️</span>
          </a>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <EventTableRowActions row={row} />,
  },
];
