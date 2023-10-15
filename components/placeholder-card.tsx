export default function PlacholderCard() {
  return (
    <div className="relative rounded-lg border border-brand-gray200 pb-10 shadow-md transition-all hover:shadow-xl dark:border-brand-gray700">
      <div className="h-44 w-full animate-pulse bg-brand-gray100 dark:bg-brand-gray800" />
      <div className="p-4">
        <div className="h-4 w-1/2 animate-pulse rounded-lg bg-brand-gray100 dark:bg-brand-gray800" />
        <div className="mt-2 h-3 w-3/4 animate-pulse rounded-lg bg-brand-gray100 dark:bg-brand-gray800" />
        <div className="mt-2 h-3 w-1/2 animate-pulse rounded-lg bg-brand-gray100 dark:bg-brand-gray800" />
      </div>
    </div>
  );
}
