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
import { createInvite } from "@/lib/actions";
import { Textarea } from "../ui/textarea";
import FormTitle from "../form-title";
import FormFooter from "../form/form-footer";

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
      const promise = createInvite(data);
      toast({
        title: "Processed invites.",
      });
      const { success, error } = await promise;
      if (!success) {
        toast({
          title: "Failed to send invite",
          description: <span>{error}</span>,
        });
      }
      router.refresh();
      // }
      modal?.hide();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full rounded-md bg-gray-200/50 backdrop-blur-xl  dark:bg-gray-900/50 md:max-w-md md:border md:border-gray-200 md:shadow dark:md:border-gray-800"
      >
        <div className="relative flex flex-col space-y-4 p-5 md:p-10">
          <FormTitle>Send invite to join {organization.name}</FormTitle>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <Input {...field} />
                <FormMessage />
                <FormDescription></FormDescription>
              </FormItem>
            )}
          />
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
        </div>
        <FormFooter>
          <FormButton loading={loading} text="Send Invite"></FormButton>
        </FormFooter>
      </form>
    </Form>
  );
}
