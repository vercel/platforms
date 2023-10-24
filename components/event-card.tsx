import BlurImage from "@/components/blur-image";
import { placeholderBlurhash, random } from "@/lib/utils";
import { Event, Organization } from "@prisma/client";
import { BarChart } from "lucide-react";
import Link from "next/link";

export default function EventCard({
  event,
}: {
  event: Event & { organization: Organization };
}) {
  const url = `${event.organization.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/events/${event.path}`;
  return (
    <div className="relative rounded-lg border border-brand-gray200 pb-10 shadow-md transition-all hover:shadow-xl dark:border-brand-gray700 dark:hover:border-white">
      <Link
        href={`/city/${event.organization.subdomain}/events/${event.path}`}
        className="flex flex-col overflow-hidden rounded-lg"
      >
        <BlurImage
          alt={event.name ?? "Card thumbnail"}
          width={500}
          height={400}
          className="h-44 object-cover"
          src={event.image ?? "/placeholder.png"}
          placeholder="blur"
          blurDataURL={event.imageBlurhash ?? placeholderBlurhash}
        />
        <div className="border-t border-brand-gray200 p-4 dark:border-brand-gray700">
          <h3 className="my-0 truncate text-xl font-bold tracking-wide text-brand-gray800 dark:text-brand-gray200">
            {event.name}
          </h3>
          <p className="text-brand-gray500 mt-2 line-clamp-1 text-sm font-normal leading-snug dark:text-brand-gray400">
            {event.description}
          </p>
        </div>
      </Link>
      <div className="absolute bottom-4 flex w-full justify-between space-x-4 px-4">
        <a
          href={
            process.env.NEXT_PUBLIC_VERCEL_ENV
              ? `https://${url}`
              : `http://${event.organization.subdomain}.localhost:3000`
          }
          target="_blank"
          rel="noreferrer"
          className="truncate rounded-md bg-brand-gray100 px-2 py-1 text-sm font-medium text-brand-gray600 transition-colors hover:bg-brand-gray200 dark:bg-brand-gray800 dark:text-brand-gray400 dark:hover:bg-brand-gray700"
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
    </div>
  );
}
