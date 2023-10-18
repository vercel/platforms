import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Image from "next/image";
import notFound from "@/app/app/(dashboard)/post/[id]/not-found";
import RoleCard from "./role-card";
import { Event, Organization, Role } from "@prisma/client";

export default async function EventRoles({
  event,
  roles,
  limit,
}: {
  event: (Event & { organization: Organization });
  roles: Role[];
  limit?: number;
}) {


  return roles.length > 0 ? (
    <div className="grid  gap-4 grid-cols-2 sm:grid-cols-3 xl:grid-cols-6">
      {roles.map((role) => (
        <RoleCard key={event.id} role={role} event={event} />
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
      <p className="text-brand-gray500 text-lg">
        You have not created any Roles yet.
      </p>
    </div>
  );
}
