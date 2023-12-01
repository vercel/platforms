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
        title: "Thanks!",
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
        className="w-full rounded-md bg-gray-200/80 backdrop-blur-lg  dark:bg-gray-900/80 md:max-w-lg md:border md:border-gray-200 md:shadow dark:md:border-gray-700"
      >
        <div className="relative flex flex-col space-y-4 p-5 md:p-10">
          <h2
            className={
              "mb-2 font-serif text-2xl font-light text-gray-800 dark:text-gray-200"
            }
          >
            Stay informed about upcoming cities
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
                <FormLabel>Name*</FormLabel>
                <Input {...field} />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email*</FormLabel>
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
                <FormLabel>(Optional) Tell us a little about yourself. What's your background? What interests you about startup cities?</FormLabel>
                <Textarea {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex items-center justify-end rounded-b-lg border-t border-gray-700 bg-gray-200 p-3 dark:border-gray-700 dark:bg-transparent md:px-10">
          <FormButton loading={loading} text={"Submit"} />
        </div>
      </form>
    </Form>
  );
}
