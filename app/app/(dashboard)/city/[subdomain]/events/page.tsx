import { Suspense } from "react";
import OrganizationEvents from "@/components/events";
import PlacholderCard from "@/components/placeholder-card";
// import OpenModalButton from "@/components/open-modal-button";
// import CreateEventModal from "@/components/modal/create-event";
import prisma from "@/lib/prisma";
import NotFoundSite from "../not-found";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import PagePadding from "@/components/page-padding";

export default async function AllEvents({
  params,
}: {
  params: { subdomain: string };
}) {
  const organization = await prisma.organization.findUnique({
    where: {
      subdomain: params.subdomain,
    },
  });

  if (!organization) {
    return <NotFoundSite />;
  }

  return (
    <PagePadding>
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-cal text-3xl font-bold dark:text-white">
            {organization.name} Events
          </h1>
          <Button asChild>
            <Link href={`/city/${params.subdomain}/events/create`}>
              Create Event
            </Link>
          </Button>
        </div>
        <Suspense
          fallback={
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <PlacholderCard key={i} />
              ))}
            </div>
          }
        >
          <OrganizationEvents organizationId={organization.id} />
        </Suspense>
      </div>
    </PagePadding>
  );
}
