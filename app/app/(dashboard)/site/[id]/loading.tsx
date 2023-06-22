// a bunch of loading divs

import PlacholderCard from "../../components/placeholder-card";

export default function Loading() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-8 py-24">
      {Array.from({ length: 8 }).map((_, i) => (
        <PlacholderCard key={i} />
      ))}
    </div>
  );
}
