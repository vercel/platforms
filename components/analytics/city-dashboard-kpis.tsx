import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import CitizensCardKPI from "./citizens-card";
import { Organization } from "@prisma/client";
import VisitorsCardKPI from "./visitors-card";
import PageViewsCardKPI from "./page-views-card";
import CampaignRevenueCardKPI from "./campaign-revenue-card";

export default async function CityDashboardKPIs({
  org,
}: {
  org: Organization;
}) {
  return (
    <>
      <div className="my-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <PageViewsCardKPI org={org} />
        <CitizensCardKPI org={org} />
        <CampaignRevenueCardKPI org={org} />
        <VisitorsCardKPI org={org} />
      </div>
    </>
  );
}
