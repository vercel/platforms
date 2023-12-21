import Image from "next/image";
import RoleCard from "./role-card";
import { Organization, Role } from "@prisma/client";
import { getSession } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { getUsersWithRoleInOrganization } from "@/lib/actions";
import prisma from "@/lib/prisma";

export default async function OrgRoles({
  params,
}: {
  params: { subdomain: string };
}) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const [org, roles, _usersWithRoles] = await Promise.all([
    prisma.organization.findUnique({
      where: {
        subdomain: params.subdomain,
      },
    }),
    prisma.role.findMany({
      where: {
        organizationRole: {
          some: {
            organization: {
              subdomain: params.subdomain,
            },
          },
        },
      },
    }),
    getUsersWithRoleInOrganization(params.subdomain),
  ]);

  if (!org) {
    return notFound();
  }

  return roles.length > 0 ? (
    <div className="grid  grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
      {roles.map((role) => (
        <RoleCard key={org.id} role={role} org={org} />
      ))}
    </div>
  ) : (
    <div className="mt-20 flex flex-col items-center space-x-4">
      <h1 className="font-cal text-4xl">No Roles Yet</h1>
      <Image
        alt="missing Role"
        src="https://illustrations.popsy.co/gray/web-design.svg"
        width={400}
        height={400}
      />
      <p className="text-lg text-gray-500">
        You have not created any Roles yet.
      </p>
    </div>
  );
}
