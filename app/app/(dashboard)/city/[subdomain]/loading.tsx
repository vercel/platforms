// a bunch of loading divs

import PlacholderCard from "@/components/placeholder-card";

export default function Loading() {
  return (
    <>
      <div className="h-10 w-48 animate-pulse rounded-md bg-gray-100 dark:bg-gray-800" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <PlacholderCard key={i} />
        ))}
      </div>
    </>
  );
}
