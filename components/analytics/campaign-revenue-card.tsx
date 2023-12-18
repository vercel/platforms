import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Organization } from "@prisma/client";
import KPICardKeyAction from "./kpi-card-key-action";

export default async function CampaignRevenueCardKPI({
  org,
}: {
  org: Organization;
}) {
  //   const citizenCount = await getCitizenCount(orgId);
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
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
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">$0</div>
        {/* <p className="text-muted-foreground text-xs">+20.1% from last month</p> */}

        <KPICardKeyAction
          title={'Raise money for ' + org.name}
          links={[
            {
              href: `/city/${org.subdomain}/campaigns`,
              display: "Launch a Campaign",
            },
          ]}
        />
      </CardContent>
    </Card>
  );
}
