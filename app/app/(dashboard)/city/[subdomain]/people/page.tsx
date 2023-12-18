import { getUsersWithRoleInOrganization } from "@/lib/actions";
import { getSession } from "@/lib/auth";
import OrgTableCard from "@/components/data-tables/org/card";
import NotFoundCity from "../not-found";

export default async function PeoplePage({
  params,
}: {
  params: { subdomain: string };
}) {
  const session = await getSession();
  if (!session?.user.id) {
    return (
      <div className="flex flex-col space-y-6">
        <h1 className="font-cal text-xl font-bold dark:text-white sm:text-3xl">
          You need to be logged in to view this page.
        </h1>
      </div>
    );
  }
  const [{ usersWithRoles, uniqueRoles }, org] = await Promise.all([
    getUsersWithRoleInOrganization(params.subdomain),
    prisma?.organization.findUnique({
      where: {
        subdomain: params.subdomain,
      },
    }),
  ]);

  if (!org) {
    return <NotFoundCity />;
  }

  return (
    <div className="h-full flex-1 flex-col md:p-8 md:flex">
      <div className="flex items-center justify-between space-y-2"></div>
      <OrgTableCard
        users={Object.values(usersWithRoles)}
        roles={Object.values(uniqueRoles)}
        organization={org}
      />
    </div>
  );
}
