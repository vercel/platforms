import prisma from "@/lib/prisma";
import Image from "next/image";
import EventListItem from "./event-list-item";
import { Event } from "@prisma/client";
import { getSiteData } from "@/lib/fetchers";

export type EventFeedEvent = Event & {
  organization: { subdomain: string | null };
  eventRole: {
    role: {
      id: string;
      image: string | null;
      name: string;
      userRoles: {
        user: EventHost;
      }[];
    };
  }[];
};

export type EventHost = {
  id: string;
  ens_name: string | null;
  image: string | null;
  username: string | null;
  name: string | null;
};

export const uniqueHosts = (event: EventFeedEvent) => {
  let acc = {} as Record<string, EventHost>;
  event.eventRole.forEach((eventRole) => {
    if (eventRole.role.name === "Host") {
      eventRole.role.userRoles.forEach((userRole) => {
        acc[userRole.user.id] = userRole.user;
      });
    }
  });
  return acc;
};

export default async function EventList({
  domain,
  limit,
  upcoming,
}: {
  domain: string;
  limit?: number;
  upcoming?: boolean
}) {
  const organization = await getSiteData(domain);
  if (!organization) {
    return;
  }
  const organizationId = organization.id;
  const events = await prisma.event.findMany({
    where: {
      organizationId: organizationId,
      ...(upcoming !== undefined ? { startingAt: { [upcoming ? 'gt' : 'lt']: new Date() } } : {}),
    },
    include: {
      //   organization: {},
      organization: {
        select: {
          subdomain: true,
        },
      },
      eventRole: {
        select: {
          role: {
            select: {
              id: true,
              image: true,
              name: true,
              userRoles: {
                select: {
                  user: {
                    select: {
                      id: true,
                      image: true,
                      name: true,
                      username: true,
                      ens_name: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    orderBy: {
      startingAt: "asc",
    },
    ...(limit ? { take: limit } : {}),
  });

  return events.length > 0 ? (
    <div className="w-full space-y-5 px-5">
      {events.map((event) => {
        const href = `/${event.path}`;

        return <EventListItem href={href} key={event.id} event={event} />;
      })}
    </div>
  ) : (
    <div className="mt-20 flex flex-col items-center space-x-4">
      <h1 className="font-cal text-4xl">No Events Yet</h1>
      <Image
        alt="missing site"
        src="https://illustrations.popsy.co/gray/web-design.svg"
        width={400}
        height={400}
      />
      <p className="text-lg text-gray-500">
        You have not hosted an event yet. Create one to get started.
      </p>
    </div>
  );
}
