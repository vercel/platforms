import LoadingDots from "@/components/icons/loading-dots";

export default function Loading() {
  return (
    <>
      <div className="h-10 w-48 rounded-md bg-stone-100 animate-pulse" />
      <div className="h-full w-full flex items-center justify-center">
        <LoadingDots />
      </div>
    </>
  );
}
