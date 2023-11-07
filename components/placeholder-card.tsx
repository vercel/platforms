export default function PlacholderCard() {
  return (
    <div className="relative rounded-lg border border-gray-200 pb-10 shadow-md transition-all hover:shadow-xl dark:border-gray-700">
      <div className="h-44 w-full animate-pulse bg-gray-100 dark:bg-gray-800" />
      <div className="p-4">
        <div className="h-4 w-1/2 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800" />
        <div className="mt-2 h-3 w-3/4 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800" />
        <div className="mt-2 h-3 w-1/2 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800" />
      </div>
    </div>
  );
}
