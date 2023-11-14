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
import { Event, Form as ForaForm, Organization, Role } from "@prisma/client";
import { CreatTicketTierFormSchema } from "@/lib/schema";
import { createTicketTier } from "@/lib/actions";

export default function CreateTicketModal({
  roles,
  event,
  forms,
  organization,
}: {
  roles: Role[];
  event: Event;
  forms: ForaForm[];
  organization: Organization;
}) {
  const form = useForm<z.infer<typeof CreatTicketTierFormSchema>>({
    resolver: zodResolver(CreatTicketTierFormSchema),
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

  async function onSubmit(data: z.infer<typeof CreatTicketTierFormSchema>) {
    const result = await createTicketTier(
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
        className="w-full rounded-md bg-gray-200/80 backdrop-blur-lg  dark:bg-gray-900/80 md:max-w-md md:border md:border-gray-200 md:shadow dark:md:border-gray-700"
      >
        <FormField
          control={form.control}
          name="roleId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Role</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an event Role to sell Tickets for" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {roles.map((role) => {
                    return (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <FormDescription>
               
                <Link
                  href={`/city/${organization.subdomain}/events/${event.path}/roles`}
                >
                   Click here to create and manage Event Roles
                </Link>
                .
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="formId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Application</FormLabel>
              <Select onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an application Form" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {forms.map((form) => {
                    return (
                      <SelectItem key={form.id} value={form.id}>
                        {form.name}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <FormDescription>
                <Link
                  href={`/city/${organization.subdomain}/events/${event.path}/forms`}
                >
                  Click here to build and manage Application Forms
                </Link>
                .
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ticket Description</FormLabel>
              <Input {...field} />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantity</FormLabel>
              <Input {...field} type="number" />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <Input {...field} type="number" />
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
