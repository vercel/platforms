import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Image from "next/image";
import notFound from "@/app/app/(dashboard)/docs/[id]/not-found";
import TicketTierCard from "./ticket-tier-card";
import { Event, Organization, Role, TicketTier } from "@prisma/client";

export default async function EventTicketTiers({
  event,
  organization,
  ticketTiers,
  limit,
}: {
  event: Event;
  organization: Organization;
  ticketTiers: (TicketTier & { role: Role })[];
  limit?: number;
}) {
  return ticketTiers.length > 0 ? (
    <div className="grid  grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
      {ticketTiers.map((ticketTier) => (
        <TicketTierCard
          key={event.id}
          ticketTier={ticketTier}
          role={ticketTier.role}
          event={event}
          organization={organization}
        />
      ))}
    </div>
  ) : (
    <div className="mt-20 flex flex-col items-center space-x-4">
      <h1 className="font-cal text-4xl">No Tickets Yet</h1>
      <Image
        alt="missing Tickets"
        src="https://illustrations.popsy.co/gray/web-design.svg"
        width={400}
        height={400}
      />
    </div>
  );
}
