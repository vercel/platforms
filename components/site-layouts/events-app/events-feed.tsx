import EventList from "@/components/event-list";

export default function EventsFeed({
  domain,
}: {
  domain: string;
}) {
  return (
    <div className="mx-auto w-full max-w-5xl pb-20">
      <h4 className="mx-5 mb-3 mt-3 font-bold tracking-tight text-gray-750 dark:text-gray-400 md:my-5 md:text-lg ">
        {"Events"}
      </h4>
      <EventList domain={domain} />
    </div>
  );
}
