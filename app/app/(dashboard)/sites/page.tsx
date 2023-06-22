import { Suspense } from "react";
import Sites from "../components/sites";

export default function AllSites({ params }: { params: { id: string } }) {
  return (
    <div className="p-8 flex flex-col space-y-12 max-w-screen-xl">
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="font-cal text-3xl font-bold">All Sites</h1>
          <button className="font-medium px-3 py-2 border border-stone-500 hover:border-black text-stone-500 hover:text-black transition-all">
            Create New Site
          </button>
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          {/* @ts-expect-error Server Component */}
          <Sites siteId={params.id} />
        </Suspense>
      </div>
    </div>
  );
}
