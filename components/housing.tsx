import prisma from "@/lib/prisma";
import EventCard from "./event-card";
import Image from "next/image";

export default async function Housing({
  organizationId,
  limit,
}: {
  organizationId: string;
  limit?: number;
}) {
  const events = await prisma.event.findMany({
    where: {
      organizationId: organizationId,
    },
    include: {
      organization: true
    },
    orderBy: {
      createdAt: "asc",
    },
    ...(limit ? { take: limit } : {}),
  });

  return events.length > 0 ? (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
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
