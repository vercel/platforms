"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "../ui/input";
import { toast } from "@/components/ui/use-toast";
import { useParams, useRouter } from "next/navigation";
import { useModal } from "./provider";
import { Event, Form as ForaForm, TicketTier } from "@prisma/client";
import { IssueTicketFormSchema } from "@/lib/schema";
import { issueTicket } from "@/lib/actions";

export default function AddAttendeesModal({
  ticketTiers,
  event,
}: {
  ticketTiers: TicketTier[];
  event: Event;
}) {
  const form = useForm<z.infer<typeof IssueTicketFormSchema>>({
    resolver: zodResolver(IssueTicketFormSchema),
    defaultValues: {
      eventId: event.id,
      currency: "USD",
    },
  });

  const router = useRouter();
  const modal = useModal();
  const { subdomain, path } = useParams() as {
    subdomain: string;
    path: string;
  };

  async function onSubmit(data: z.infer<typeof IssueTicketFormSchema>) {
    const result = await issueTicket(
      data,
      { params: { subdomain, path } },
      "",
    );
    router.refresh();
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
    modal?.hide();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full p-4 space-y-4 rounded-md bg-gray-200/80 backdrop-blur-lg dark:bg-gray-900/80 md:max-w-md md:border md:border-gray-200 md:shadow dark:md:border-gray-700"
      >
        <FormField
          control={form.control}
          name="tierId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ticket Tier</FormLabel>
              <Select onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {ticketTiers.map((tier) => {
                    return (
                      <SelectItem key={tier.id} value={tier.id}>
                        {tier.name}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ticket Name</FormLabel>
              <Input {...field} />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amountPaid"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount paid so far</FormLabel>
              <Input {...field} type="number" />
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" >Submit</Button>
      </form>
    </Form>
  );
}
