import { getUsersWithTicketForEvent } from "@/lib/actions";
import AddAttendeesModal from "../modal/add-attendees";
import OpenModalButton from "../open-modal-button";
import { CardHeader, CardTitle, CardContent } from "../ui/card";
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
    <div>
      <CardTitle>Attendees</CardTitle>
      <DataTable data={data} columns={columns} />
      <div className="mt-4 flex justify-end">
        <OpenModalButton text="Request payments" className="mr-2">
          Request Payments
        </OpenModalButton>
        <OpenModalButton text="Add attendees">
          <AddAttendeesModal ticketTiers={ticketTiers} event={event} />
        </OpenModalButton>
      </div>
    </div>
  );
}
