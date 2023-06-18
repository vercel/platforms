import { Suspense } from "react";
import Sites from "./components/sites";
import OverviewStats from "./components/overview-stats";

export default function Overview() {
  return (
    <div className="p-8 flex flex-col space-y-12 max-w-screen-xl">
      <div className="flex flex-col space-y-6">
        <h1 className="font-cal text-3xl font-bold">Overview</h1>
        <OverviewStats />
      </div>

      <div className="flex flex-col space-y-6">
        <h1 className="font-cal text-3xl font-bold">Top Sites</h1>
        <Suspense fallback={<div>Loading...</div>}>
          {/* @ts-expect-error Server Component */}
          <Sites limit={4} />
        </Suspense>
      </div>
    </div>
  );
}
