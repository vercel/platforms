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
import { useParams, useRouter } from "next/navigation";
import { useModal } from "./provider";
import { CreatePlaceSchema } from "@/lib/schema";
import { createPlace } from "@/lib/actions";
import { Feature, Point, Polygon } from "geojson";
import { experimental_useFormStatus as useFormStatus } from "react-dom";
import PrimaryButton from "../primary-button";

export default function CreatePlaceModal({
  geoJSON,
  lng,
  lat,
}: {
  geoJSON?: Feature<Polygon> | Feature<Point>;
  lng?: number;
  lat?: number;
}) {
  const form = useForm<z.infer<typeof CreatePlaceSchema>>({
    resolver: zodResolver(CreatePlaceSchema),
  });
  const { pending } = useFormStatus();

  const router = useRouter();
  const modal = useModal();
  const { subdomain, path } = useParams() as {
    subdomain: string;
    path: string;
  };

  async function onSubmit(data: z.infer<typeof CreatePlaceSchema>) {
    console.log("on Submit");

    const result = await createPlace(
      data,
      { params: { subdomain: subdomain as string } },
      null,
    );
    console.log("result");

    router.refresh();
    toast({
      title: "Successfully created a new Property",
     
    });
    modal?.hide();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full rounded-md bg-gray-200/80 px-6 py-6 backdrop-blur-lg  dark:bg-gray-900/80 md:max-w-md md:border md:border-gray-200 md:shadow dark:md:border-gray-700"
      >
        {/* <GeocodeInput /> */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Place Name</FormLabel>
              <Input {...field} />
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
