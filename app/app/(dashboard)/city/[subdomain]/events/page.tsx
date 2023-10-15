import { Suspense } from "react";
import OrganizationEvents from "@/components/events";
import PlacholderCard from "@/components/placeholder-card";
import OpenModalButton from "@/components/open-modal-button";
import CreateEventModal from "@/components/modal/create-event";
import prisma from "@/lib/prisma";
import NotFoundSite from "../not-found";

export default async function AllEvents({
  params,
}: {
  params: { subdomain: string; id: string };
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
    <div className="flex max-w-screen-xl flex-col space-y-12 p-8">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-cal text-3xl font-bold dark:text-white">
            {organization.name} Events
          </h1>
          <OpenModalButton text="Create Event">
            <CreateEventModal organization={organization} />
          </OpenModalButton>
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
    </div>
  );
}
