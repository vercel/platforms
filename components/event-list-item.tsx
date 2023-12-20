import Link from "next/link";
import { format } from "date-fns";
import EventListItemImage from "./event-list-item-image";
import { EventFeedEvent, uniqueHosts } from "./event-list";

export default function EventListItem({
  event,
  href,
  showAnalytics = false,
}: {
  event: EventFeedEvent;
  href?: string;
  showAnalytics?: boolean;
}) {
  console.log("event: ", event);
  const url = `${event.organization.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/events/${event.path}`;

  const hosts = uniqueHosts(event);
  return (
    <>
      {event.startingAt ? (
        <div className="mb-3 space-x-2">
          <span className="text-lg font-semibold tracking-tight text-gray-900 dark:text-gray-100">
            {format(event.startingAt, "MMM d, yyyy")}
          </span>
          <span className="font-medium text-gray-600 dark:text-gray-400">
            {format(event.startingAt, "EEEE")}
          </span>
        </div>
      ) : null}
      <Link
        href={
          href || `/city/${event.organization.subdomain}/events/${event.path}`
        }
      >
        <div className="relative flex  rounded-2xl border border-gray-200 shadow-md  transition-all hover:shadow-xl dark:border-gray-700 dark:hover:border-white md:flex-row">
          <div className="flex-1 border-gray-200 p-3 dark:border-gray-700">
            {event.startingAt ? (
              <span className="text-sm">
                {format(event.startingAt, "h:mm a")}
              </span>
            ) : null}
            <h3 className="mb-2 truncate text-lg font-medium tracking-wide text-gray-800 dark:text-gray-200">
              {event.name}
            </h3>
            
            {/* <p className="mb-2 line-clamp-2 text-sm font-normal leading-snug text-gray-650 dark:text-gray-350">
              {event.description}
            </p> */}
          </div>

          <div className="p-3">
            <EventListItemImage
              alt={event.name ?? "Card thumbnail"}
              src={event.image ?? "/placeholder.png"}
            />
          </div>
        </div>
      </Link>
    </>
  );
}
