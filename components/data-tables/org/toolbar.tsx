"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "@/components/ui/data-table/data-table-view-options";

import { DataTableFacetedFilter } from "@/components/ui/data-table/data-table-faceted-filter";
import PeopleActions from "./actions";
import { useMemo } from "react";
import { Organization, Role } from "@prisma/client";

interface OrgTableToolbarProps<TData> {
  table: Table<TData>;
  roles: Role[];
  organization: Organization
}

export default function OrgTableToolbar<TData>({
  table,
  roles,
  organization,
}: OrgTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const rolesOptions = useMemo(() => {
    return roles.map((role) => {
      return {
        label: role.name,
        value: role.name,
      };
    });
  }, [roles]);

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Search"
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        <DataTableViewOptions table={table} />

        {table.getColumn("roles") && (
          <DataTableFacetedFilter
            column={table.getColumn("roles")}
            title="Roles"
            options={rolesOptions}
          />
        )}
        {/* {table.getColumn("priority") && (
          <DataTableFacetedFilter
            column={table.getColumn("priority")}
            title="Priority"
            options={priorities}
          />
        )} */}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex flex-1 items-center space-x-2">
        <PeopleActions table={table} roles={roles} organization={organization} />
      </div>
    </div>
  );
}
