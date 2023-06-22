import { Suspense } from "react";
import Sites from "./components/sites";
import OverviewStats from "./components/overview-stats";
import Posts from "./components/posts";
import Link from "next/link";

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
            className="font-medium px-3 py-2 border border-stone-500 hover:border-black text-stone-500 hover:text-black transition-all"
          >
            View All Sites
          </Link>
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          {/* @ts-expect-error Server Component */}
          <Sites limit={4} />
        </Suspense>
      </div>

      <div className="flex flex-col space-y-6">
        <h1 className="font-cal text-3xl font-bold">Recent Posts</h1>
        <Suspense fallback={<div>Loading...</div>}>
          {/* @ts-expect-error Server Component */}
          <Posts limit={8} />
        </Suspense>
      </div>
    </div>
  );
}
