"use client";

import { toast } from "sonner";
import { createEvent } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import LoadingDots from "@/components/icons/loading-dots";
import { useModal } from "./provider";
import va from "@vercel/analytics";
import { useEffect, useState } from "react";
import { Organization } from "@prisma/client";
import FormButton from "./form-button";
import { DatePicker } from "../form-builder/date-picker";
import TimePicker from "../ui/time-picker";
import { Input } from "../ui/input";

export function combineDateAndTime(date: Date, timeInMs: string) {
  const timeElapsed = parseInt(timeInMs);

  const hours = Math.floor(timeElapsed / (1000 * 60 * 60));
  const minutes = Math.floor(
    (timeElapsed - hours * 1000 * 60 * 60) / (1000 * 60),
  );
  const seconds = Math.floor(
    (timeElapsed - hours * 1000 * 60 * 60 - minutes * 1000 * 60) / 1000,
  );
  const milliseconds = timeElapsed % 1000;

  const combined = new Date(date);
  combined.setHours(hours);
  combined.setMinutes(minutes);
  combined.setSeconds(seconds);
  combined.setMilliseconds(milliseconds);

  console.log("combined date and time: ", combined.toISOString());
  return combined;
}

export default function CreateEventModal({
  organization,
}: {
  organization: Organization;
}) {
  const router = useRouter();
  const modal = useModal();

  const [data, setData] = useState<{
    name: string;
    description: string;
    path: string;
    startingAtDate?: Date;
    startingAtTime?: string;
    endingAtDate?: Date;
    endingAtTime?: string;
  }>({
    name: "",
    description: "",
    path: "",
    startingAtDate: new Date(),
    startingAtTime: undefined,

    endingAtDate: new Date(),
    endingAtTime: undefined,
  });

  useEffect(() => {
    setData((prev) => ({
      ...prev,
      path: prev.name
        .toLowerCase()
        .trim()
        .replace(/[\W_]+/g, "-"),
    }));
  }, [data.name]);

  const onSubmit = async () => {
    createEvent({
      name: data.name as string,
      description: data.description as string,
      path: data.path as string,
      organizationId: organization.id,
      startingAt:
        data.startingAtDate && data.startingAtTime
          ? combineDateAndTime(data.startingAtDate, data.startingAtTime)
          : new Date(),
      endingAt:
        data.endingAtDate && data.endingAtTime
          ? combineDateAndTime(data.endingAtDate, data.endingAtTime)
          : new Date(),
    }).then((res: any) => {
      if (res.error) {
        toast.error(res.error);
      } else {
        va.track("Created Event");
        const { path } = res;
        toast.success(`Successfully created Event!`);
        router.push(`/city/${organization.subdomain}/events/${path}`);
      }
    });
  };

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto w-full rounded-md bg-white dark:bg-gray-900 md:max-w-md md:border md:border-gray-200 md:shadow dark:md:border-gray-700"
    >
      <div className="m.d:p-10 relative flex flex-col space-y-4 p-5">
        <h2 className="font-cal text-2xl dark:text-white">
          Create a new event
        </h2>

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="name"
            className="text-sm font-medium text-gray-700 dark:text-gray-400"
          >
            Name
          </label>
          <Input
            name="name"
            type="text"
            placeholder="My Awesome Event"
            autoFocus
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
            maxLength={64}
            required
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="path"
            className="text-sm font-medium text-gray-700 dark:text-gray-400"
          >
            Path
          </label>
          <div className="flex w-full max-w-md">
            <div className="flex items-center rounded-r-lg border border-l-0 border-gray-200 bg-gray-100 px-3 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400">
              {organization.subdomain}.{process.env.NEXT_PUBLIC_ROOT_DOMAIN}/
            </div>
            <Input
              name="path"
              type="text"
              placeholder="path"
              value={data.path}
              onChange={(e) => setData({ ...data, path: e.target.value })}
              autoCapitalize="off"
              pattern="[a-zA-Z0-9\-]+" // only allow lowercase letters, numbers, and dashes
              maxLength={6432}
              required
            />
          </div>
        </div>

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="description"
            className="text-sm font-medium text-gray-700 dark:text-gray-400"
          >
            Description
          </label>
          <textarea
            name="description"
            value={data.description}
            onChange={(e) => setData({ ...data, description: e.target.value })}
            maxLength={280}
            rows={3}
            className="w-full rounded-md border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-900  focus:outline-none focus:ring-gray-900 dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:placeholder-gray-700 dark:focus:ring-white"
          />
        </div>
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-400">
            Starts At
          </label>
          <div className="flex">
            <DatePicker
              date={data.startingAtDate}
              onSelect={(date) => {
                setData((prev) => ({ ...prev, startingAtDate: date }));
              }}
            />
            <TimePicker
              value={data.startingAtTime}
              onValueChange={(value) => {
                setData((prev) => ({ ...prev, startingAtTime: value }));
              }}
            />
          </div>
        </div>
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-400">
            Ends At
          </label>
          <div className="flex">
            <DatePicker
              date={data.endingAtDate}
              onSelect={(date) => {
                setData((prev) => ({ ...prev, endingAtDate: date }));
              }}
            />
            <TimePicker
              value={data.endingAtTime}
              onValueChange={(value) => {
                setData((prev) => ({ ...prev, endingAtTime: value }));
              }}
            />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end rounded-b-lg border-t border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800 md:px-10">
        <FormButton text={"Create Event"} />
      </div>
    </form>
  );
}
