"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "../ui/input";
import { toast } from "@/components/ui/use-toast";
import { useParams } from "next/navigation";
import { UpdatePlaceSchema } from "@/lib/schema";
import { upsertPlace } from "@/lib/actions";
import { useFormStatus } from "react-dom";
import PrimaryButton from "../buttons/primary-button";
import { Place } from "@prisma/client";
import { useEffect } from "react";

export default function EditPlaceModal({ place }: { place: Place }) {
  const form = useForm<z.infer<typeof UpdatePlaceSchema>>({
    resolver: zodResolver(UpdatePlaceSchema),
  });

  useEffect(() => {
    const placeWithUndefines = Object.entries(place).reduce(
      (acc: any, [key, value]) => {
        acc[key] = value === null ? undefined : value;
        return acc;
      },
      {} as Partial<Place>,
    );
    form.reset(placeWithUndefines);
  }, [place]);

  const { pending } = useFormStatus();

  const { subdomain, path } = useParams() as {
    subdomain: string;
    path: string;
  };

  async function onSubmit(data: z.infer<typeof UpdatePlaceSchema>) {
    await upsertPlace(
      data,
      { params: { subdomain: subdomain as string } },
      null,
    );

    toast({
      title: "Successfully updated a Property",
    });
  }

  console.log("pending: ", pending);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full px-3 py-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Place Name</FormLabel>
              <Input {...field} value={field.value || ""} />
              <FormMessage />
            </FormItem>
          )}
        />
        <PrimaryButton loading={pending} type="submit">
          Submit
        </PrimaryButton>
      </form>
    </Form>
  );
}
