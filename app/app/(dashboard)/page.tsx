import { Suspense } from "react";
import Sites from "./components/sites";
import OverviewStats from "./components/overview-stats";
import Posts from "./components/posts";
import Link from "next/link";
import PlacholderCard from "./components/placeholder-card";

export default function Overview() {
  return (
    <div className="p-8 flex flex-col space-y-12 max-w-screen-xl">
      <div className="flex flex-col space-y-6">
        <h1 className="font-cal text-3xl font-bold">Overview</h1>
        <OverviewStats />
      </div>

      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="font-cal text-3xl font-bold">Top Sites</h1>
          <Link
            href="/sites"
            className="font-medium text-sm px-3 py-1.5 rounded-lg border border-stone-300 hover:border-black text-stone-500 hover:text-black transition-all"
          >
            View All Sites
          </Link>
        </div>
        <Suspense
          fallback={
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <PlacholderCard key={i} />
              ))}
            </div>
          }
        >
          <Sites limit={4} />
        </Suspense>
      </div>

      <div className="flex flex-col space-y-6">
        <h1 className="font-cal text-3xl font-bold">Recent Posts</h1>
        <Suspense
          fallback={
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <PlacholderCard key={i} />
              ))}
            </div>
          }
        >
          <Posts limit={8} />
        </Suspense>
      </div>
    </div>
  );
}
