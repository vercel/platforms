export default function PlacholderCard() {
  return (
    <div className="relative rounded-lg shadow-md hover:shadow-xl border border-stone-200 transition-all pb-10">
      <div className="h-44 w-full bg-stone-100 animate-pulse" />
      <div className="p-4">
        <div className="h-4 w-1/2 bg-stone-100 animate-pulse rounded-lg" />
        <div className="mt-2 h-3 w-3/4 bg-stone-100 animate-pulse rounded-lg" />
        <div className="mt-2 h-3 w-1/2 bg-stone-100 animate-pulse rounded-lg" />
      </div>
    </div>
  );
}
