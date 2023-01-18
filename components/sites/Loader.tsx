export default function Loader() {
  return (
    <div className="w-full my-10">
      <div className="h-10 w-60 mx-auto bg-gray-200 animate-pulse md:rounded-md" />
      <div className="w-full max-w-screen-xl md:w-3/4 mx-auto my-12">
        <div className="h-80 sm:h-150 w-full mx-auto bg-gray-200 animate-pulse md:rounded-xl" />
        <div className="mt-10 w-5/6 mx-auto md:w-full flex flex-col space-y-4">
          <div className="h-20 w-48 bg-gray-200 animate-pulse rounded-md" />
          <div className="h-12 w-96 bg-gray-200 animate-pulse rounded-md" />
          <div className="h-12 w-80 bg-gray-200 animate-pulse rounded-md" />
        </div>
      </div>
    </div>
  );
}
