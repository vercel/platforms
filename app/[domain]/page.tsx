import { notFound } from "next/navigation";
import { getSiteData } from "@/lib/fetchers";
import prisma from "@/lib/prisma";
// import EventCard from "@/components/event-card";
import Link from "next/link";
import BlurImage from "@/components/blur-image";
import { placeholderBlurhash } from "@/lib/utils";
import { Organization, Event } from "@prisma/client";
import SocialLandingPage from "@/components/site-layouts/social-landing-page";

export default async function SiteHomePage({
  params,
}: {
  params: { domain: string };
}) {
  // domain = domain.replace('%3A', ':');
  const domain = params.domain.replace("%3A", ":");
  // const session = await getSession();
  const [sitedata] = await Promise.all([getSiteData(domain)]);

  const events = await prisma.event.findMany({
    where: {
      organizationId: sitedata?.id,
    },
    include: {
      organization: true,
    },
    orderBy: {
      createdAt: "asc",
    },
    take: 3,
  });

  if (!sitedata) {
    notFound();
  }

  return <SocialLandingPage sitedata={sitedata} />;
}

function UpcomingOrgEventsSection({
  events,
}: {
  events: (Event & { organization: Organization })[];
}) {
  if (!events || !(events?.length > 0)) {
    return null;
  }

  return (
    <div className="bg-gray-900 p-8 lg:p-12">
      <h2 className="mb-8 font-serif text-3xl text-gray-300">Next Event</h2>
      <div className="dark grid grid-cols-1 gap-4 sm:grid-cols-2  lg:grid-cols-3 xl:grid-cols-4">
        {events.map((event) => (
          <Link
            key={event.id}
            href={`/${event.path}`}
            className="flex flex-col overflow-hidden rounded-lg border border-gray-750 bg-gray-850 transition-colors hover:bg-gray-800"
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
            <div className="border-t  border-gray-800 p-4">
              <h3 className="my-0 text-xl font-semibold tracking-wide text-gray-200">
                {event.name}
              </h3>
              <p className="mt-2 line-clamp-6 text-sm font-normal leading-snug  text-gray-400">
                {event.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
