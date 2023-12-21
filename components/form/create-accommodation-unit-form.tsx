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
import { useFormStatus } from "react-dom";
import PrimaryButton from "../buttons/primary-button";
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
import { DateRangePicker } from "../form-builder/date-range-picker";
import { Button } from "../ui/button";
import { calcAccommodationUnitCapacity } from "@/lib/utils";

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
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-4 py-6"
      >
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

        <div className="flex flex-col">
          <div className="flex justify-between">
            <FormLabel>{"Unit Capacity"}</FormLabel>
            {calcAccommodationUnitCapacity(form.watch("rooms") || [])}
          </div>
          {roomFields.map((item, index) => (
            <>
              <RoomField
                key={item.id}
                formControl={form.control}
                roomIndex={index}
              />
              <Button
                variant={"ghost"}
                type="button"
                onClick={() => removeRoom(index)}
              >
                Remove Room
              </Button>
            </>
          ))}
          <Button
            type="button"
            variant={"ghost"}
            onClick={(e) => {
              e.preventDefault();
              appendRoom({
                name: "Room " + (roomFields.length + 1),
                beds: [{ type: "SINGLE" }],
              });
            }}
          >
            Add Room
          </Button>
        </div>

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Type</FormLabel>
              <FormDescription>
                Use to group similar accommodation units and make duplicates,
                i.e., Deluxe, Suites, Studios.
              </FormDescription>
              <Input {...field} value={field.value || ""} />

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={"availability"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Available From</FormLabel>
              <FormControl>
                <DateRangePicker
                  date={{
                    from: field?.value?.startDate,
                    to: field?.value?.endDate,
                  }}
                  onSelect={(date) => {
                    console.log("date: ", date);
                    form.setValue("availability", {
                      // @ts-expect-error
                      startDate: date?.from ? new Date(date.from) : undefined,
                      // @ts-expect-error
                      endDate: date?.to ? new Date(date.to) : undefined,
                    });
                  }} 
                />
              </FormControl>
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
          <Button
            variant={"ghost"}
            type="button"
            onClick={() => removeBed(bedIndex)}
          >
            Remove Bed
          </Button>
        </div>
      ))}
      <Button
        variant={"ghost"}
        type="button"
        onClick={() => appendBed({ type: "SINGLE" })}
      >
        Add Bed
      </Button>
    </div>
  );
}
