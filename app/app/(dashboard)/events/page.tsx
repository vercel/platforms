import { Suspense } from "react";
import Organizations from "@/components/organizations";
import PlacholderCard from "@/components/placeholder-card";
import CreateOrganizationButton from "@/components/create-organization-button";
import CreateOrganizationModal from "@/components/modal/create-organization";

export default function AllEvents({ params }: { params: { id: string } }) {
  return (
    <div className="flex max-w-screen-xl flex-col space-y-12 p-8">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-cal text-3xl font-bold dark:text-white">
            All Events
          </h1>
          <CreateOrganizationButton>
            <CreateOrganizationModal />
          </CreateOrganizationButton>
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
          {/* @ts-expect-error Server Component */}
          <Organizations organizationId={params.id} />
        </Suspense>
      </div>
    </div>
  );
}
