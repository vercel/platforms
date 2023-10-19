import * as z from 'zod';
export const CreatTicketTierFormSchema = z.object({
    name: z.string().nonempty({ message: "Name is required." }),
    description: z.string().optional(),
    eventId: z.string().nonempty({ message: "Event ID is required." }),
    roleId: z.string().nonempty({ message: "Role ID is required." }),
    formId: z.string().optional(),
    quantity: z.coerce.number().int().nonnegative(),
    price: z.coerce.number().nonnegative(),
    currency: z.string().nonempty({ message: "Currency is required." }),
  });
  