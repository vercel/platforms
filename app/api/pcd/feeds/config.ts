import { TicketCategory } from "@pcd/eddsa-ticket-pcd";
import { z } from "zod";

const TicketSchema = z.object({
  attendeeEmail: z.string(),
  attendeeName: z.string(),
  eventName: z.string(),
  ticketName: z.string(),
  ticketId: z.string().uuid(),
  eventId: z.string().uuid(),
  productId: z.string().uuid(),
  ticketCategory: z
    .enum(["Devconnect", "ZuConnect", "Zuzalu", "Generic"])
    .transform((str) => {
      switch (str) {
        case "Devconnect":
          return TicketCategory.Devconnect;
        case "ZuConnect":
          return TicketCategory.ZuConnect;
        case "Zuzalu":
          return TicketCategory.Zuzalu;
        case "Generic":
          return TicketCategory.PcdWorkingGroup;
        default:
          throw new Error("Unknown ticket category");
      }
    }),
});

export type Ticket = z.infer<typeof TicketSchema>;

const TicketFileSchema = z.record(z.array(TicketSchema));

export async function loadTickets(): Promise<Record<string, Ticket[]>> {
  const tickets = TicketFileSchema.parse(mockTickets);
  return tickets;
}

const mockTickets = {
  "First folder": [
    {
      attendeeEmail: "test@example.com",
      attendeeName: "Test user",
      eventName: "Test event",
      ticketName: "Attendee",
      ticketId: "f65d8af8-e4c8-41c1-b9e2-0fb5d197c2ba",
      eventId: "3e8970cf-499b-4679-967b-8aa6647b288e",
      productId: "a9f5e8a9-5a6e-4419-aa80-5c0f18efb6dd",
      ticketCategory: "Generic",
    },
  ],
  "Second folder": [
    {
      attendeeEmail: "test@example.com",
      attendeeName: "Test user",
      eventName: "Another event",
      ticketName: "Organizer",
      ticketId: "f4831ea1-6781-4427-bdd9-c61fbb695d87",
      eventId: "8f8f02fd-9977-431e-ae80-0ed5e19f6ec9",
      productId: "d10bb7bf-d8b8-4214-afc7-0af9199d2b18",
      ticketCategory: "Generic",
    },
  ],
};
