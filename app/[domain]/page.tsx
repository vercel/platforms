import { notFound } from "next/navigation";
import { getPostsForOrganization, getSiteData } from "@/lib/fetchers";
import { getSession } from "@/lib/auth";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";
import Events from "@/components/events";
import prisma from "@/lib/prisma";
import EventCard from "@/components/event-card";

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
      <div className="relative w-full rounded-lg pb-5 transition-all dark:border-gray-700 dark:hover:border-white lg:max-h-[80%]">
        <div className="flex flex-col md:flex-row">
          <div className="p-12 md:w-1/2">
            <h1 className="font-serif text-4xl">{sitedata.header}</h1>
            <p className="font-serif text-4xl">{sitedata.description}</p>
          </div>
          <div className="w-full md:w-1/2">
            <div className="p-12">
              {sitedata.image ? (
                <AspectRatio ratio={1 / 1}>
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {events.map((event) => (
            <EventCard href={`/${event.path}`} key={event.id} event={event} />
          ))}
        </div>
      </div>
    </>
  );
}
