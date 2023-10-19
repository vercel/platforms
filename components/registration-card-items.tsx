import { TicketTier, Role, Organization, Event } from "@prisma/client";
import { Card } from "@tremor/react";
import Link from "next/link";

type RegistrationCardItemProps = {
  ticketTier: TicketTier & { role: Role };
  event: Event & { organization: Organization };
};

export function RegistrationCardItems({
  ticketTier,
  event,
}: RegistrationCardItemProps) {

  return (
    <Link href={`/${event.path}/apply/${ticketTier.id}`} key={ticketTier.id}>
      <Card className="hover:border-white">
        <h3 className="font-bold">{ticketTier.name}</h3>
        <p>{ticketTier.description}</p>
        <p>Role: {ticketTier.role.name}</p>
        <p>Issued: {ticketTier.issued}</p>
        <p>Quantity: {ticketTier.quantity}</p>
        <p>
          Price: {ticketTier.price} {ticketTier.currency}
        </p>
      </Card>
    </Link>
  );
}
