import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Event from "@/components/event-page";
import { getEventRolesAndUsers, getEventTicketTiers } from "@/lib/actions";
import { AttendeeTableCard } from "@/components/data-tables/event/event-attendee-table";



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


  return <AttendeeTableCard event={event} />
}
