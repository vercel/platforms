// import { getUsersWithTicketForEvent } from "@/lib/actions";
import { UsersWithRolesInOrg } from "@/lib/types";
import { Card } from "../../ui/card";
import { columns } from "./columns";
import DataTable from "./data-table";
import { Organization, Role, User } from "@prisma/client";

export default function OrgTableCard({
  organization,
  users,
  roles,
}: {
  organization: Organization;
  users: UsersWithRolesInOrg;
  roles: Role[];
}) {
  return (
    <>
      <div className="mb-4 md:mb-6">
        <h1 className="mb-4 font-serif text-4xl font-light tracking-tight md:mb-3">
          The People of {organization.name}
        </h1>
      </div>
      <DataTable
        data={users}
        columns={columns}
        organization={organization}
        users={users}
        roles={roles}
      />
    </>
  );
}
