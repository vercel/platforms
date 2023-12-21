import { getCitizenCount, getUniqueEventVisitors } from "@/lib/actions";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { TicketIcon } from "lucide-react";
import KPICardKeyAction from "./kpi-card-key-action";
import { Organization } from "@prisma/client";

export default async function VisitorsCardKPI({ org }: { org: Organization }) {
  const popupVisitors = await getUniqueEventVisitors(org.id);
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Attendees</CardTitle>
        <TicketIcon className="h-4 w-4" />
      </CardHeader>
      <CardContent>
        <h5 className="text-3xl font-bold">{popupVisitors}</h5>

        {/* <p className="text-muted-foreground text-xs">
          +{popupVisitors} from last month
        </p> */}
        <KPICardKeyAction
          title="Improve all metrics"
          links={[
            {
              href: `/city/${org.subdomain}/events`,
              display: `Host a pop-up city`,
            },
          ]}
        />
      </CardContent>
    </Card>
  );
}
