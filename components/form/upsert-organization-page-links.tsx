"use client";

import LoadingDots from "@/components/icons/loading-dots";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import DomainStatus from "./domain-status";
import DomainConfiguration from "./domain-configuration";
import Uploader from "./uploader";
import { toast } from "@/components/ui/use-toast";

import {
  Control,
  FieldValues,
  UseFormReturn,
  useFieldArray,
  useForm,
} from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import * as z from "zod";
import { upsertOrganizationLinks } from "@/lib/actions";
import { UpsertOrganizationLinkSchemas } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "../modal/form-button";
import { OrganizationPageLinks } from "@prisma/client";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Trash } from "lucide-react";
import { useState } from "react";

const INITIAL_LINK = { href: "", display: "", isPrimary: false };

export default function UpsertOrganizationPageLinksForm({
  title,
  description,
  helpText,
  pageLinks,
}: {
  title: string;
  description: string;
  helpText: string;
  pageLinks: OrganizationPageLinks[];
}) {
  // const params = useParams() as { subdomain?: string; path?: string };
  const router = useRouter();

  const { subdomain, path } = useParams() as {
    subdomain: string;
    path: string;
  };

  const { update } = useSession();

  const form = useForm<z.infer<typeof UpsertOrganizationLinkSchemas>>({
    resolver: zodResolver(UpsertOrganizationLinkSchemas),
    defaultValues: {
      pageLinks: pageLinks.map((link) => ({
        ...link,
        image: link.image || undefined,
      })),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "pageLinks",
  });

  const updatePrimaryLink = (index: number) => {
    const currentLinks = form.getValues("pageLinks");
    const isAlreadyPrimary = currentLinks[index].isPrimary;

    const updatedLinks = currentLinks.map((item, idx) => ({
      ...item,
      isPrimary: isAlreadyPrimary ? false : idx === index,
    }));

    form.setValue("pageLinks", updatedLinks);
  };

  const [loading, setLoading] = useState(false);

  async function onSubmit(data: z.infer<typeof UpsertOrganizationLinkSchemas>) {
    try {
      setLoading(true);
      await upsertOrganizationLinks(
        data,
        { params: { subdomain: subdomain as string } },
        null,
      );

      router.refresh();

      toast({
        title: "Successfully saved resource.",
      });
    } catch (error) {
      console.log(error)
      toast({
        title: "FAILED with error: " + error,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900"
      >
        <div className="relative flex flex-col space-y-4 p-5 sm:p-10">
          <h2 className="font-cal text-xl dark:text-white">{title}</h2>
          <p className="text-sm text-gray-700 dark:text-gray-400">
            {description}
          </p>
        </div>

        <div className="px-10 space-y-8">
          {fields.map((item, index) => (
            <div key={item.id} className="flex">
              <div className="flex flex-1 space-x-3 ">
                <FormField
                  control={form.control}
                  name={`pageLinks.${index}.href`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Link</FormLabel>
                      <Input className="h-8 flex-1 w-full" {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`pageLinks.${index}.display`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display</FormLabel>
                      <Input className="h-8 w-full" {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`pageLinks.${index}.isPrimary`}
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex flex-col">
                        <FormLabel className="leading-[1.5rem]">
                          Primary
                        </FormLabel>
                        <Checkbox
                          className="mb-2 mt-3 h-5 w-5"
                          onCheckedChange={() => updatePrimaryLink(index)}
                          checked={form.getValues(
                            `pageLinks.${index}.isPrimary`,
                          )}
                        />
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex mt-[1.75rem]">
                <Button
                  type="button"
                  variant={"ghost"}
                  size={"icon"}
                  className=""
                  onClick={() => remove(index)}
                >
                  <Trash width={18} />
                </Button>
              </div>
            </div>
          ))}
        </div>
        <Button
          className="m-5 mx-10"
          type="button"
          size={'sm'}
          onClick={() => append(INITIAL_LINK)}
        >
          Add Link
        </Button>
        <div className="flex flex-col items-center justify-center space-y-2 rounded-b-lg border-t border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800 sm:flex-row sm:justify-between sm:space-y-0 sm:px-10">
          <p className="text-sm text-gray-700 dark:text-gray-400">{helpText}</p>
          <FormButton loading={loading} text={"Save"} />
        </div>
      </form>
    </Form>
  );
}
