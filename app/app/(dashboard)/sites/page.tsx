import { Suspense } from "react";
import Sites from "../components/sites";
import PlacholderCard from "../components/placeholder-card";
import ModalButton from "@/app/modal/button";
import CreateSiteModal from "@/app/modal/create-site";

export default function AllSites({ params }: { params: { id: string } }) {
  return (
    <div className="p-8 flex flex-col space-y-12 max-w-screen-xl">
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="font-cal text-3xl font-bold">All Sites</h1>
          <ModalButton text="Create New Site">
            <CreateSiteModal />
          </ModalButton>
        </div>
        <Suspense
          fallback={
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <PlacholderCard key={i} />
              ))}
            </div>
          }
        >
          {/* @ts-expect-error Server Component */}
          <Sites siteId={params.id} />
        </Suspense>
      </div>
    </div>
  );
}
