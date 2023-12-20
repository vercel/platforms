import BlurImage from "@/components/blur-image";
import { placeholderBlurhash, random } from "@/lib/utils";
import { Event, Organization } from "@prisma/client";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { BarChart } from "lucide-react";
import Link from "next/link";
import { format } from 'date-fns';

export default function EventCard({
  event,
  href,
  showAnalytics = false,
}: {
  event: Event & { organization: Organization };
  href?: string;
  showAnalytics?: boolean;
}) {
  const url = `${event.organization.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/events/${event.path}`;
  return (
    <div className="relative rounded-lg border border-gray-200 pb-10 shadow-md transition-all hover:shadow-xl dark:border-gray-700 dark:hover:border-white">
      <Link
        href={
          href || `/city/${event.organization.subdomain}/events/${event.path}`
        }
        className="flex flex-col overflow-hidden rounded-lg"
      >
        <BlurImage
          alt={event.name ?? "Card thumbnail"}
          className="object-cover"
          src={event.image ?? "/placeholder.png"}
          placeholder="blur"
          blurDataURL={event.imageBlurhash ?? placeholderBlurhash}
          width={800}
          height={400}
        />
        <div className="border-t border-gray-200 p-4 dark:border-gray-700">
          <h3 className="my-0 truncate text-xl font-bold tracking-wide text-gray-800 dark:text-gray-200">
            {event.name}
          </h3>
          <p className="mt-2 line-clamp-1 text-sm font-normal leading-snug text-gray-500 dark:text-gray-400">
            {event.description}
          </p>

          {event.startingAt ? <div className="text-sm font-medium">
            {format(event.startingAt, 'EEEE, MMMM d, yyyy')}
          </div> : null}
        </div>
      </Link>
      {showAnalytics && (
        <div className="absolute bottom-4 flex w-full justify-between space-x-4 px-4">
          <a
            href={
              process.env.NEXT_PUBLIC_VERCEL_ENV
                ? `https://${url}`
                : `http://${event.organization.subdomain}.localhost:3000`
            }
            target="_blank"
            rel="noreferrer"
            className="truncate rounded-md bg-gray-100 px-2 py-1 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
          >
            {url} ↗
          </a>
          <Link
            href={`/city/${event.organization.subdomain}/analytics`}
            className="flex items-center rounded-md bg-green-100 px-2 py-1 text-sm font-medium text-green-600 transition-colors hover:bg-green-200 dark:bg-green-900 dark:bg-opacity-50 dark:text-green-400 dark:hover:bg-green-800 dark:hover:bg-opacity-50"
          >
            <BarChart height={16} />
            <p>{random(10, 40)}%</p>
          </Link>
        </div>
      )}
    </div>
  );
}
