import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import OrganizationCard from "./organization-card";
import Image from "next/image";

export default async function Organizations({ limit }: { limit?: number }) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  const userRoles = await prisma.userRole.findMany({
    where: {
      userId: session.user.id as string,
    },
    include: {
      role: {
        include: {
          organizationRole: {
            include: {
              organization: true,
            },
          },
        },
      },
    },
    ...(limit ? { take: limit } : {}),
  });
  
  const organizations = userRoles.flatMap((userRole) =>
    userRole.role.organizationRole.map((orgRole) => orgRole.organization)
  );

  return organizations.length > 0 ? (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {organizations.map((organization) => (
        <OrganizationCard key={organization.id} data={organization} />
      ))}
    </div>
  ) : (
    <div className="mt-20 flex flex-col items-center space-x-4">
      <h1 className="font-cal text-4xl">No Cities Yet</h1>
      <Image
        alt="missing city"
        src="https://illustrations.popsy.co/gray/web-design.svg"
        width={400}
        height={400}
      />
      <p className="text-lg text-brand-gray500">
        You do not have any cities yet. Create one to get started.
      </p>
    </div>
  );
}
