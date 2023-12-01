"use client";
import { Ticket, User } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { shortenString } from "@/lib/profile";


export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "thisEventTickets",
    header: "Tickets",
    cell: ({ row }) => {
      // const amount = parseFloat(row.getValue("amount"))
      // const formatted = new Intl.NumberFormat("en-US", {
      //   style: "currency",
      //   currency: "USD",
      // }).format(amount)

      const tickets = row.getValue("thisEventTickets") as Ticket[];

      return (
        <div className="flex flex-wrap space-x-1">
          {tickets.map((ticket) => {
            return (
              <Badge key={ticket.id} variant="default">
                {ticket.tierId}
              </Badge>
            );
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
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
];