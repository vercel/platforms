// a bunch of loading divs

export default function Loading() {
  return (
    <>
      <div className="h-10 w-48 rounded-md bg-stone-100 animate-pulse" />
      <div className="h-96 w-full max-w-screen-md rounded-md bg-stone-100 animate-pulse" />
    </>
  );
}
