import PaperDoc from "@/components/paper-doc";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { TicketTier, Event, Role, Form, Ticket, Question } from "@prisma/client";
import { redirect } from "next/navigation";
import notFound from "../../not-found";


export default async function CheckoutPage({
  params,
}: {
  params: { path: string; subdomain: string, ticketTierId: string };
}) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

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
          questions: true
        }
      }, // Include related form data
      tickets: true, // Include related tickets data
    },
  });
  
  if (!ticketTier) {
    return notFound()
    // Handle case where ticketTier is not found
  }

  return (
    <div className="flex flex-col space-y-6">
      <CheckoutComponent ticketTier={ticketTier} />
    </div>
  );
}

type TicketTierWithContext = TicketTier & {
  event: Event,
  role: Role,
  form:( Form & { questions: Question[] }) | null,
  tickets: Ticket[],
}

const CheckoutComponent = ({ ticketTier }: { ticketTier: TicketTierWithContext }) => {
  return (
    <div>
      <h2>{ticketTier.name}</h2>
      <p>{ticketTier.description}</p>
      <p>Price: {ticketTier.price} {ticketTier.currency}</p>
      <h3>Event: {ticketTier.event.name}</h3>
      {ticketTier.form && (
        <div>
          <h4>Form Questions:</h4>
          {ticketTier.form.questions.map((question, index) => (
            <div key={index}>
              <p>{question.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};