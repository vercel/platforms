"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Control,
  FieldValues,
  UseFormReturn,
  useFieldArray,
  useForm,
} from "react-hook-form";
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
import { useParams, useRouter } from "next/navigation";
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
import { useModal } from "../modal/provider";

export default function CreateAccomodationUnitForm({
  place,
}: {
  place: Place;
}) {
  const form = useForm<z.infer<typeof CreateAccommodationUnitSchema>>({
    resolver: zodResolver(CreateAccommodationUnitSchema),
    defaultValues: {
      placeId: place.id,
      capacity: 1,
    },
  });

  const {
    fields: roomFields,
    append: appendRoom,
    update: updateRoom,
    remove: removeRoom,
  } = useFieldArray({
    control: form.control,
    name: "rooms",
  });

  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const modal = useModal();

  const { subdomain, path } = useParams() as {
    subdomain: string;
    path: string;
  };

  async function onSubmit(data: z.infer<typeof CreateAccommodationUnitSchema>) {
    try {
      setLoading(true);
      await createAccommodationUnit(
        data,
        { params: { subdomain: subdomain as string } },
        null,
      );

      toast({
        title: "Successfully updated a Property",
      });
      router.refresh();
      modal?.hide();
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-h-[80vh] w-full space-y-6 overflow-y-scroll rounded-md bg-gray-200/80 px-6 py-6  backdrop-blur-lg dark:bg-gray-900/80 md:max-w-md md:border md:border-gray-200 md:shadow dark:md:border-gray-700"
      >
        <FormTitle>Add Accommodation</FormTitle>
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Type</FormLabel>
              <FormDescription>
                A grouping of similar accommodation types on the property:
                Double Deluxe, Suite, Studio.
              </FormDescription>
              <Input {...field} value={field.value || ""} />

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Name</FormLabel>
              <FormDescription>Usually the room number</FormDescription>
              <Input {...field} value={field.value || ""} />
              <FormMessage />
            </FormItem>
          )}
        />
        {roomFields.map((item, index) => (
          <>
            <RoomField
              key={item.id}
              formControl={form.control}
              roomIndex={index}
            />
            <button type="button" onClick={() => removeRoom(index)}>
              Remove Room
            </button>
          </>
        ))}

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            appendRoom({
              name: "Room " + roomFields.length + 1,
              beds: [{ type: "SINGLE" }],
            });
          }}
        >
          Add Room
        </button>
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

type RoomFieldProps = {
  formControl: Control<z.infer<typeof CreateAccommodationUnitSchema>>; // replace 'any' with the type of your form data
  roomIndex: number;
};

function RoomField({ formControl, roomIndex }: RoomFieldProps) {
  const {
    fields: bedFields,
    append: appendBed,
    remove: removeBed,
  } = useFieldArray({
    control: formControl,
    name: `rooms.${roomIndex}.beds`,
  });

  return (
    <div>
      <FormField
        control={formControl}
        name={`rooms.${roomIndex}.name`}
        render={({ field }) => (
          <FormItem className="flex-1">
            <FormLabel>Room Name</FormLabel>
            <Input {...field} value={field.value || ""} />
            <FormMessage />
          </FormItem>
        )}
      />

      {bedFields.map((bedItem, bedIndex) => (
        <div key={bedItem.id}>
          <FormField
            control={formControl}
            name={`rooms.${roomIndex}.beds.${bedIndex}.type`}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Bed Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Bed Type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="SINGLE">Single</SelectItem>
                    <SelectItem value="DOUBLE">Double</SelectItem>
                    <SelectItem value="QUEEN">Queen</SelectItem>
                    <SelectItem value="KING">King</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <button type="button" onClick={() => removeBed(bedIndex)}>
            Remove Bed
          </button>
        </div>
      ))}
      <button type="button" onClick={() => appendBed({ type: "SINGLE" })}>
        Add Bed
      </button>
    </div>
  );
}
