import { notFound } from "next/navigation";
import { getPostsForOrganization, getSiteData } from "@/lib/fetchers";
import { getSession } from "@/lib/auth";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";
import Events from "@/components/events";
import prisma from "@/lib/prisma";
import EventCard from "@/components/event-card";
import Link from "next/link";
import BlurImage from "@/components/blur-image";
import { placeholderBlurhash } from "@/lib/utils";

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

  return (
    <>
      <div className="relative w-full rounded-lg transition-all dark:border-gray-700 dark:hover:border-white">
        <div className="flex max-h-[90vh] flex-col md:flex-row lg:max-h-[90vh] lg:p-12">
          <div className="p-12 pr-6 md:w-1/2">
            <h1 className="text-4xl font-semibold lg:text-5xl xl:text-6xl">
              {sitedata.header}
            </h1>
            <p className="mt-4 text-xl">{sitedata.description}</p>
          </div>
          <div className="w-full md:w-1/2">
            <div className="overflow-hidden p-12">
              {sitedata.image ? (
                <AspectRatio
                  ratio={
                    sitedata?.imageAspectRato
                      ? Number.parseFloat(sitedata?.imageAspectRato)
                      : 1 / 1
                  }
                >
                  <Image
                    src={sitedata.image}
                    alt={`${sitedata?.name} Hero Image` ?? "Hero Image"}
                    blurDataURL={sitedata?.imageBlurhash ?? undefined}
                    layout="fill"
                  />
                </AspectRatio>
              ) : null}
            </div>
          </div>
        </div>

        <div className="bg-gray-900 p-8 lg:p-12">
          <h2 className="mb-8 text-3xl text-gray-300">Upcoming Pop Ups</h2>
          <div className="dark grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {events.map((event) => (
              <Link
                key={event.id}
                href={`/${event.path}`}
                className="flex flex-col overflow-hidden rounded-lg border border-gray-750 bg-gray-850"
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
                  <h3 className="my-0 truncate text-xl font-bold tracking-wide text-gray-200">
                    {event.name}
                  </h3>
                  <p className="mt-2 line-clamp-1 text-sm font-normal leading-snug  text-gray-400">
                    {event.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
