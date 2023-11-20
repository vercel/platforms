"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "../ui/input";
import { toast } from "@/components/ui/use-toast";
import { useParams } from "next/navigation";
import { CreateAccommodationUnitSchema } from "@/lib/schema";
import { createAccommodationUnit, upsertPlace } from "@/lib/actions";
import { experimental_useFormStatus as useFormStatus } from "react-dom";
import PrimaryButton from "../primary-button";
import { Place } from "@prisma/client";
import { useEffect, useState } from "react";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import FormTitle from "../form-title";

export default function CreateAccomodationUnitForm({
  place,
}: {
  place: Place;
}) {
  const form = useForm<z.infer<typeof CreateAccommodationUnitSchema>>({
    resolver: zodResolver(CreateAccommodationUnitSchema),
    defaultValues: {
      placeId: place.id,
      type: "HOTEL",
      capacity: 1,
      beds: 1,
      rooms: 1,
    },
  });

  const [loading, setLoading] = useState(false);

  const { subdomain, path } = useParams() as {
    subdomain: string;
    path: string;
  };

  async function onSubmit(data: z.infer<typeof CreateAccommodationUnitSchema>) {
    try {
      setLoading(true)
      await createAccommodationUnit(
        data,
        { params: { subdomain: subdomain as string } },
        null,
      );
  
      toast({
        title: "Successfully updated a Property",
      });
    } catch (error) {
      
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-6 rounded-md bg-gray-200/80 px-6 py-6  backdrop-blur-lg dark:bg-gray-900/80 md:max-w-md md:border md:border-gray-200 md:shadow dark:md:border-gray-700"
      >
        <FormTitle>Add Accommodation</FormTitle>
        <div className="flex space-x-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Name</FormLabel>
                <Input {...field} value={field.value || ""} />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Rooms" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem key={"HOTEL"} value={"HOTEL"}>
                      Hotel
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </div>

        <div className="flex space-x-6">
          <FormField
            control={form.control}
            name="rooms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rooms</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Rooms" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Array.from({ length: 8 }, (_, i) => i + 1).map(
                      (number) => (
                        <SelectItem key={number} value={number.toString()}>
                          {number} Rooms
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="beds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Beds</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Beds" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Array.from({ length: 8 }, (_, i) => i + 1).map(
                      (number) => (
                        <SelectItem key={number} value={number.toString()}>
                          {number} Beds
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="capacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Capacity</FormLabel>
                <Input type="number" {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{"Description (optional)"}</FormLabel>
              <Textarea {...field} value={field.value || ""} />
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="py-3">
          <PrimaryButton loading={loading} type="submit">
            Submit
          </PrimaryButton>
        </div>
      </form>
    </Form>
  );
}
