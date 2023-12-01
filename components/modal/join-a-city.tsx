"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "../ui/input";
import { toast } from "@/components/ui/use-toast";
// import { useRouter } from "next/navigation";
import { useModal } from "./provider";
import { JoinACitySchema } from "@/lib/schema";
import FormButton from "./form-button";
import { Textarea } from "../ui/textarea";
import { createEmailSubscriber } from "@/lib/actions";
import { EmailSubscriberInterest } from "@prisma/client";
import { useState } from "react";

export default function JoinACityModal() {
  const form = useForm<z.infer<typeof JoinACitySchema>>({
    resolver: zodResolver(JoinACitySchema),
  });
  const [loading, setLoading] = useState(false);

  // const router = useRouter();
  const modal = useModal();

  async function onSubmit(data: z.infer<typeof JoinACitySchema>) {
    try {
      setLoading(true);
      await createEmailSubscriber({
        ...data,
        indicatedInterest: EmailSubscriberInterest.JOIN,
      });
      toast({
        title: "Successfully submitted.",
      });
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
        className="w-full rounded-md border-gray-850 bg-gray-200/70  backdrop-blur-xl dark:bg-gray-900/80 md:max-w-lg md:border md:shadow dark:md:border-gray-700"
      >
        <div className="relative flex flex-col space-y-4 p-5 text-gray-850 dark:text-gray-200 md:p-10">
          <h2 className={"mb-2 font-serif text-2xl font-light "}>
            Get an intro to a startup city.
          </h2>
          {/* <p
            className={
              "font-medium text-md text-gray-800 dark:text-gray-350"
            }
          >
            Browse, visit, and apply for citizenship
          </p> */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Name</FormLabel>
                <Input
                  className="border-gray-700 dark:border-gray-300"
                  {...field}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Email</FormLabel>
                <Input
                  className="border-gray-700 dark:border-gray-300"
                  {...field}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tell us a little about yourself.</FormLabel>
                <Textarea
                  className="border-gray-700 dark:border-gray-300"
                  {...field}
                />
                <FormDescription className="text-gray-800 dark:text-gray-300">
                  Minimum 60 characters
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex items-center justify-end rounded-b-lg border-t border-gray-700 bg-transparent p-3 dark:border-gray-700 dark:bg-transparent md:px-10">
          <FormButton loading={loading} text={"Submit"} />
        </div>
      </form>
    </Form>
  );
}
