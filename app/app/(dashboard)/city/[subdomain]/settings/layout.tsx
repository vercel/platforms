import { ReactNode } from "react";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import OrganizationSettingsNav from "./nav";
import { userHasOrgRole } from "@/lib/actions";

export default async function SiteSettingsLayout({
  params,
  children,
}: {
  params: { subdomain: string };
  children: ReactNode;
}) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  const organization = await prisma.organization.findUnique({
    where: {
      subdomain: params.subdomain,
    },
  });

  if (!organization) {
    notFound();
  }

  const userIsAdmin = await userHasOrgRole(
    session.user.id,
    organization?.id,
    "Admin",
  );

  if (!userIsAdmin) {
    notFound();
  }

  const url = `${organization.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;

  return (
    <>
      <div className="flex flex-col items-center space-x-4 space-y-2 sm:flex-row sm:space-y-0">
        <h1 className="font-cal text-xl font-bold dark:text-white sm:text-3xl">
          Settings for {organization.name}
        </h1>
        <a
          href={
            process.env.NEXT_PUBLIC_VERCEL_ENV
              ? `https://${url}`
              : `http://${organization.subdomain}.localhost:3000`
          }
          target="_blank"
          rel="noreferrer"
          className="truncate rounded-md bg-gray-100 px-2 py-1 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
        >
          {url} ↗
        </a>
      </div>
      <OrganizationSettingsNav />
      {children}
    </>
  );
}
