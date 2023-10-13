// a bunch of loading divs

export default function Loading() {
  return (
    <>
      <div className="h-10 w-48 animate-pulse rounded-md bg-stone-100 dark:bg-stone-800" />
      <div className="h-96 w-full max-w-screen-md animate-pulse rounded-md bg-stone-100 dark:bg-stone-800" />
    </>
  );
}
