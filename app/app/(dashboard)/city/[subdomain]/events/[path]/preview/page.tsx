import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Event from "@/components/event-page";
import { getEventRolesAndUsers, getEventTicketTiers } from "@/lib/actions";

export default async function EventPage({
  params,
}: {
  params: { path: string };
}) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const event = await prisma.event.findFirst({
    where: {
      path: params.path,
    },
    include: {
      organization: true,
    },
  });

  if (!event) {
    notFound();
  }

  const rolesAndUsers = await getEventRolesAndUsers(event.id);

  const ticketTiers = await getEventTicketTiers(event.id);

  return <Event event={event} rolesAndUsers={rolesAndUsers} ticketTiers={ticketTiers} />;
}
