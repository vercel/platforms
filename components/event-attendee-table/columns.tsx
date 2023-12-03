"use client";
import { Ticket, User } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { shortenString } from "@/lib/profile";

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "thisEventTickets",
    header: "Ticket",
    cell: ({ row }) => {
      const tickets = row.getValue("thisEventTickets") as Array<Ticket & { tierName: string }>;
      return (
        <div className="flex flex-wrap space-x-1">
          {tickets.map((ticket) => (
            <span key={ticket.id}>{ticket.tierName}</span>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "thisEventTickets",
    header: "Price",
    cell: ({ row }) => {
      const tickets = row.getValue("thisEventTickets") as Array<Ticket & { tierPrice: number }>;
      return (
        <div className="flex flex-wrap space-x-1">
          {tickets.map((ticket) => {
            const formattedPrice = new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(ticket.tierPrice);
            return <span key={ticket.id}>{formattedPrice}</span>;
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "thisEventTickets",
    header: "Paid?",
    cell: ({ row }) => {
      const tickets = row.getValue("thisEventTickets") as Array<Ticket & { tierPrice: number, amountPaid: number }>;
      return (
        <div className="flex flex-wrap space-x-1">
          {tickets.map((ticket) => {
            if (ticket.amountPaid < ticket.tierPrice) {
              const formattedAmountOwed = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(ticket.tierPrice - ticket.amountPaid);
              return <span key={ticket.id} className="text-red-500">Owes {formattedAmountOwed}</span>;
            } else if (ticket.amountPaid === ticket.tierPrice) {
              return <span key={ticket.id} className="text-green-500">✓</span>;
            } else {
              const formattedAmountOverpaid = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(ticket.amountPaid - ticket.tierPrice);
              return <span key={ticket.id} className="text-red-500">⚠️ Overpaid by {formattedAmountOverpaid}</span>;
            }
          })}
        </div>
      );
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
];