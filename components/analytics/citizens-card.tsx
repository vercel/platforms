import { getCitizenCount } from "@/lib/actions";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import KPICardKeyAction from "./kpi-card-key-action";
import { Organization } from "@prisma/client";

export default async function CitizensCardKPI({ org }: { org: Organization }) {
  const citizenCount = await getCitizenCount(org.id);
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Citizens</CardTitle>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          className="text-muted-foreground h-4 w-4"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      </CardHeader>
      <CardContent>
        <h5 className="text-3xl font-bold">{citizenCount}</h5>
        <KPICardKeyAction
          title="Build your community"
          links={[
            {
              href: `/city/${org.subdomain}/people`,
              display: `Invite a friend`,
            },
            // {
            //   href: `/city/${org.subdomain}/forms`,
            //   display: `Create a city application`,
            // },
          ]}
        />
      </CardContent>
    </Card>
  );
}
