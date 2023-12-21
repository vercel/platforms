import { getSession } from "@/lib/auth";
import { notFound } from "next/navigation";
import { ReactNode } from "react";
import { getUserOrgRolesBySubdomain } from "@/lib/actions";
import NotFoundCity from "./not-found";

export default async function CityLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { subdomain: string };
}) {
  const session = await getSession();
  // require user to be signed in
  if (!session) {
    return notFound();
  }

  const orgRoles = await getUserOrgRolesBySubdomain({
    userId: session.user.id,
    orgIdOrSubdomain: params.subdomain,
  });

  // user has no roles. protect the app route
  if (orgRoles.length === 0) {
    return (
      <div className="flex max-w-screen-xl flex-col space-y-12 p-8">
        <div className="flex flex-col space-y-6">
          <NotFoundCity />
        </div>
      </div>
    );
  }

  return (
    <div className="flex max-w-screen-xl flex-col space-y-12 p-8">
      <div className="flex flex-col space-y-6">{children}</div>
    </div>
  );
}
