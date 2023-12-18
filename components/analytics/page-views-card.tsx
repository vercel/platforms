import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { getCityPageViews } from "@/lib/tinybird";
import KPICardKeyAction from "./kpi-card-key-action";
import { Organization } from "@prisma/client";

export default async function PageViewsCardKPI({ org }: { org: Organization }) {
  const pageViews = await getCityPageViews("fora");
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Page Views</CardTitle>
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
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      </CardHeader>
      <CardContent>
        <h5 className="text-3xl font-bold">
          {pageViews ? pageViews.reduce((a, v) => v["count()"] + a, 0) : 0}
        </h5>

        <KPICardKeyAction
          title="Build awareness"
          links={[
            {
              href: `/city/${org.subdomain}/docs`,
              display: `Publish your vision`,
            },
            // {
            //   href: `/city/${org.subdomain}/docs`,
            //   display: `Host a meetup for citizens`,
            // },
          ]}
        />
      </CardContent>
    </Card>
  );
}
