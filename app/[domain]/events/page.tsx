// import AllEvents from "@/app/app/(dashboard)/city/[subdomain]/events/page";
import DashboardHeader from "@/components/dashboard-header";
import PagePadding from "@/components/page-padding";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Suspense } from "react";
import EventList from "@/components/event-list";

export default function SiteEvents({ params }: { params: { domain: string } }) {
  return (
    <div className="md:p-8 w-full max-w-4xl mx-auto">
        <div className="h-14 md:h-0" />
      <PagePadding>
        <div className="">
          <DashboardHeader
            title="Events"
            ActionButton={
              <Button asChild>
                <Link href={`/events/create`}>Create Event</Link>
              </Button>
            }
          />
        </div>
      </PagePadding>

      <Suspense>
        <EventList domain={params.domain} />
      </Suspense>
    </div>
  );
}
