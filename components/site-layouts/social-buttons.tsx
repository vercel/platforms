export default function SocialButtons({
  citizens,
  visited,
  backers,
}: {
  citizens: number;
  visited: number;
  backers: number;
}) {
  return (
    <div className="mb-3 flex text-gray-700 dark:text-gray-400">
      <button className="mr-5 flex items-center justify-center rounded-md border border-transparent text-sm font-medium ">
        <span className="text-md mr-1 font-bold text-gray-850 dark:text-gray-200">{citizens}</span>
        <span>Citizens</span>
      </button>
      <button className="mr-5 flex items-center justify-center rounded-md border border-transparent text-sm font-medium ">
        <span className="text-md mr-1 font-bold text-gray-850 dark:text-gray-200">{backers}</span>
        <span>Backers</span>
      </button>
      <button className="mr-5 flex items-center justify-center rounded-md border border-transparent text-sm font-medium ">
        <span className="text-md mr-1 font-bold text-gray-850 dark:text-gray-200">{visited}</span>
        <span>Visitors</span>
      </button>
    </div>
  );
}
