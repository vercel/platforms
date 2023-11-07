import PaperDoc from "@/components/paper-doc";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {
  TicketTier,
  Event,
  Role,
  Form,
  Ticket,
  Question,
} from "@prisma/client";
import notFound from "../../not-found";
import FormTitle from "@/components/form-title";
import DynamicForm from "../dynamic-form";
import Siwe from "@/components/siwe";

export default async function CheckoutPage({
  params,
}: {
  params: { slug: string; domain: string; ticketTierId: string };
}) {
  const session = await getSession();
  // if (!session) {
  //   redirect("/login");
  // }

  const ticketTierId = params.ticketTierId; // Get the ticketTierId from params

  const ticketTier = await prisma.ticketTier.findUnique({
    where: {
      id: ticketTierId,
    },
    include: {
      event: true, // Include related event data
      role: true, // Include related role data
      form: {
        include: {
          questions: true,
        },
      }, // Include related form data
      tickets: true, // Include related tickets data
    },
  });

  if (!ticketTier) {
    return notFound();
    // Handle case where ticketTier is not found
  }

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col space-y-6">
        <PaperDoc className="mx-auto">
          <FormTitle>{ticketTier.name}</FormTitle>
          <p>{ticketTier.description}</p>
          <p>
            Price: {ticketTier.price} {ticketTier.currency}
          </p>
          <h3>Event: {ticketTier.event.name}</h3>
          {!session && <Siwe callbackUrl={`/${params.slug}/apply/${ticketTierId}`} />}
          {session && ticketTier.form && (
            <DynamicForm form={ticketTier.form} />
          )}
        </PaperDoc>
      </div>
    </div>
  );
}

type TicketTierWithContext = TicketTier & {
  event: Event;
  role: Role;
  form: (Form & { questions: Question[] }) | null;
  tickets: Ticket[];
};
