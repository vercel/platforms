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
import { Organization, Role } from "@prisma/client";
import { CreateInviteSchema } from "@/lib/schema";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import FormButton from "./form-button";
import { SessionData } from "@/lib/auth";
import { createInvite } from "@/lib/actions";

export default function InviteModal({
  roles,
  organization,
}: {
  roles: Role[];
  organization: Organization;
}) {
  const { data: session } = useSession();
  const form = useForm<z.infer<typeof CreateInviteSchema>>({
    resolver: zodResolver(CreateInviteSchema),
    defaultValues: {
      organizationId: organization.id,
    },
  });

  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const modal = useModal();

  useEffect(() => {
    if (session?.user.id) {
      form.setValue("inviterId", session?.user.id);
    }
  }, [session, form]);
  // const { subdomain, path } = useParams() as {
  //   subdomain: string;
  //   path: string;
  // };

  async function onSubmit(data: z.infer<typeof CreateInviteSchema>) {
    try {
      setLoading(true);
      createInvite(data)
      toast({
        title: "You submitted the following values:",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{JSON.stringify(data, null, 2)}</code>
          </pre>
        ),
      });
      router.refresh();
      // }
      modal?.hide();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
    // const result = await issueTicket(data, { params: { subdomain, path } }, "");

    // if (result.error) {
    //   console.log("result.error: ", result.error);
    //   toast({
    //     title: "Error occurred",
    //     description: result.error || "Please try again later 🤕",
    //   });
    // } else {
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-4 rounded-md bg-gray-200/80 p-4 backdrop-blur-lg dark:bg-gray-900/80 md:max-w-md md:border md:border-gray-200 md:shadow dark:md:border-gray-700"
      >
        <FormField
          control={form.control}
          name="roleId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
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
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <Input {...field} />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormButton loading={loading} text="Send Invite"></FormButton>
      </form>
    </Form>
  );
}
