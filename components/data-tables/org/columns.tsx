"use client";
import { Role, User } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { convertNameToTwoLetters, shortenString } from "@/lib/profile";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import { OrgTableRowActions } from "./row-actions";

export type UserAndRoles = User & { roles: Role[] };

export const columns: ColumnDef<UserAndRoles>[] = [
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
    enableGlobalFilter: true,
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    accessorKey: "roles",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Roles" />
    ),
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
    filterFn: (row, id, filterValues) => {
      const roles = row.getValue("roles") as Role[];

      if (filterValues.length === 0) return true;

      return roles.some((t) => filterValues.includes(t.name));
    },
  },
  {
    accessorKey: "eth_address",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Wallet" />
    ),
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
    cell: ({ row }) => <OrgTableRowActions row={row} />,
  },
];
