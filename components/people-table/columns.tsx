"use client";
import { Role, User } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { convertNameToTwoLetters, shortenString } from "@/lib/profile";
import { Avatar, AvatarImage } from "../ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";

export type UserAndRoles = User & { roles: Role[] };

export const columns: ColumnDef<UserAndRoles>[] = [
  //   {
  //     accessorKey: "image",
  //     header: "Avatar",
  //     cell: ({ row }) => {
  //       const url = row.getValue("image") as string | undefined;
  //       const name = row.getValue("name") as string | undefined;

  //       return (
  //         <Avatar>
  //           {url ? <AvatarImage src={url}></AvatarImage> : null}
  //           <AvatarFallback>
  //             {name ? convertNameToTwoLetters(name) : null}
  //           </AvatarFallback>
  //         </Avatar>
  //       );
  //     },
  //   },

  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "roles",
    header: "Roles",
    cell: ({ row }) => {
      // const amount = parseFloat(row.getValue("amount"))
      // const formatted = new Intl.NumberFormat("en-US", {
      //   style: "currency",
      //   currency: "USD",
      // }).format(amount)

      const roles = row.getValue("roles") as Role[];

      return (
        <div className="flex flex-wrap space-x-1">
          {roles.map((role) => {
            return (
              <Badge key={role.id} variant="default">
                {role.name}
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
      return (
        <div className="flex items-center">
          <a
            href={`https://etherscan.io/address/${address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline underline-offset-1"
          >
            <span>{shortenString(address, 6, 6)}</span>
            <span className="ml-1.5">↗️</span>
          </a>
        </div>
      );
    },
  },
];
