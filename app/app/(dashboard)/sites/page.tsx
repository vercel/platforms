import { Suspense } from "react";
import Sites from "../components/sites";
import PlacholderCard from "../components/placeholder-card";

export default function AllSites({ params }: { params: { id: string } }) {
  return (
    <div className="p-8 flex flex-col space-y-12 max-w-screen-xl">
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="font-cal text-3xl font-bold">All Sites</h1>
          <button className="font-medium text-sm px-3 py-1.5 rounded-lg border border-stone-300 hover:border-black text-stone-500 hover:text-black transition-all">
            Create New Site
          </button>
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
