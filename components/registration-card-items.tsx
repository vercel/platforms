import { TicketTier, Role, Organization, Event } from "@prisma/client";
import { Card } from "@/components/ui/card";
import RegistrationCardLink from "./registration-card-link";

type RegistrationCardItemProps = {
  ticketTier: TicketTier & { role: Role };
  event: Event & { organization: Organization };
};

export function RegistrationCardItems({
  ticketTier,
  event,
}: RegistrationCardItemProps) {
  return (
    // <RegistrationCardLink eventPath={event.path} ticketTierId={ticketTier.id} key={ticketTier.id}>
      <Card className="hover:border-white p-4">
        <h3 className="font-bold">{ticketTier.name}</h3>
        <p>{ticketTier.description}</p>
        <p>{ticketTier.issued} of {ticketTier.quantity} issued</p>
        <p>
          {ticketTier.currency === 'USD' ? `\$${ticketTier.price}` : `${ticketTier.price} ${ticketTier.currency}`}
        </p>
      </Card>
    // </RegistrationCardLink>
  );
}