import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import PageHeader from "@/components/page-header";
import OpenModalButton from "@/components/open-modal-button";
import CreateTicketModal from "@/components/modal/create-tickets";
import prisma from "@/lib/prisma";
import notFound from "../not-found";
import EventTicketTiers from "@/components/ticket-tiers";

export default async function EventTicketsPage({
  params,
}: {
  params: { path: string; subdomain: string };
}) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  //   const rolesAndUsers = await getEventRoles(event.id);
  const event = await prisma.event.findFirst({
    where: {
      path: params.path,
      organization: {
        subdomain: params.subdomain,
      },
    },
    include: {
      organization: true,
    },
  });

  if (!event) {
    return notFound();
  }
  const eventRoles = await prisma.eventRole.findMany({
    where: {
      eventId: event.id,
    },
    include: {
      role: true,
    },
  });
  const roles = eventRoles.map((eventRole) => eventRole.role);

  const ticketTiers = await prisma.ticketTier.findMany({
    where: {
      eventId: event.id,
    },
    include: {
      role: true,
    },
  });

  return (
    <div className="flex flex-col space-y-6">
      <PageHeader
        title="Event Ticketing"
        ActionButton={
          <OpenModalButton text="Create Tickets">
            <CreateTicketModal
              roles={roles}
              event={event}
              organization={event.organization}
            />
          </OpenModalButton>
        }
      />
      <EventTicketTiers
        organization={event.organization}
        event={event}
        ticketTiers={ticketTiers}
      />
    </div>
  );
}
