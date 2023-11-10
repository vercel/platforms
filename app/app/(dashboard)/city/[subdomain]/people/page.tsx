import OrganizationPeopleDataTable from "@/components/people-table/data-table";
import { columns } from "@/components/people-table/columns";
import { getUsersWithRoleInOrganization } from "@/lib/actions";
import { getSession } from "@/lib/auth";

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
  const data = await getUsersWithRoleInOrganization(params.subdomain);

  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        {/* <div>
          <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
          <p className="text-muted-foreground">
            Here&apos;s a list of your tasks for this month!
          </p>
        </div> */}
        {/* <div className="flex items-center space-x-2">
        <UserNav />
      </div> */}
      </div>
      <OrganizationPeopleDataTable data={data} columns={columns} />
    </div>
  );
}
