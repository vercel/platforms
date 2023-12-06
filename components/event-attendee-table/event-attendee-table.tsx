import { getUsersWithTicketForEvent } from "@/lib/actions";
import { Card } from "../ui/card";
import { columns } from "./columns";
import DataTable from "./data-table";
import prisma from "@/lib/prisma";
import { Event, Organization } from "@prisma/client";

export async function AttendeeTableCard({
  event,
}: {
  event: Event & { organization: Organization };
}) {
  const ticketTiers = await prisma.ticketTier.findMany({
    where: {
      eventId: event.id,
    },
  });

  const data = await getUsersWithTicketForEvent(event.path);
  return (
    <Card className="space-y-8 p-2 md:p-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          {event.name} Attendees
        </h2>
        <p className="">
          <span className="font-medium">Rapidly</span> manage your attendees.
        </p>
      </div>
      <DataTable
        data={data}
        columns={columns}
        ticketTiers={ticketTiers}
        event={event}
      />
    </Card>
  );
}
