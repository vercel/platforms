"use client";

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
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { Form as FormType, Question, QuestionType } from "@prisma/client";
import { QuestionDataInputUpdate } from "@/lib/actions";
import { useEffect, useState } from "react";
import { JsonArray, JsonObject } from "@prisma/client/runtime/library";
import { DatePicker } from "./date-picker";
import { Textarea } from "../ui/textarea";

const QuestionSettingsSchema = z.object({
  required: z.boolean().default(false).optional(),
  fromDate: z.string().optional(),
  toDate: z.string().optional(),
  min: z.string().optional(),
  max: z.string().optional(),
  variants: z.string().optional(),
});

export function QuestionSettingsForm({
  question,
  handleUpdateQuestion,
}: {
  question: Question;
  handleUpdateQuestion: (
    id: string,
    data: QuestionDataInputUpdate,
  ) => Promise<void>;
}) {
  const form = useForm<z.infer<typeof QuestionSettingsSchema>>({
    resolver: zodResolver(QuestionSettingsSchema),
  });

  useEffect(() => {
    form?.reset();
    form?.setValue("required", question?.required || undefined);
    form?.setValue("fromDate", question?.fromDate?.toISOString() || undefined);
    form?.setValue("toDate", question?.toDate?.toISOString() || undefined);
    const variants = question?.variants
      ? (question?.variants as {
          [name: string]: string;
        }[])
      : undefined;
    const variantStr =
      variants?.map((variant) => variant.name).join("\n") ?? "";

    console.log("variantStr: ", variantStr);
    form?.setValue("variants", variantStr);
  }, [form, question]);

  async function onSubmit(data: z.infer<typeof QuestionSettingsSchema>) {
    const variants = data.variants
      ? data.variants
          .split("\n")
          .map((variant) => ({ name: variant, value: variant }))
      : undefined;

    handleUpdateQuestion(question.id, {
      id: question.id,
      ...data,
      variants,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <div>
          <h3 className="mb-4 text-lg font-medium text-gray-700 dark:text-gray-300">
            Settings
          </h3>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="required"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between space-x-1 rounded-lg py-3">
                  <div className="space-y-0.5">
                    <FormLabel>Required</FormLabel>
                    <FormDescription>
                      Require this question to be answered
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={(value: boolean) => {
                        field.onChange(value);
                        onSubmit({ required: value });
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            {(question.type === QuestionType.SELECT ||
              question.type === QuestionType.MULTI_SELECT ||
              question.type === QuestionType.DROPDOWN) && (
              <FormField
                control={form.control}
                name="variants"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-center justify-between space-x-1 rounded-lg py-3">
                    <div className="space-y-0.5">
                      <FormLabel>Variants</FormLabel>
                      <FormDescription>
                        Add variants for the select, separated by a new line.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Textarea
                        {...field}
                        className="h-20 w-full rounded border p-2"
                        placeholder="Enter variants..."
                      />
                    </FormControl>
                    <Button type="submit" className="mt-2">
                      Save Variants
                    </Button>
                  </FormItem>
                )}
              />
            )}
            {(question.type === QuestionType.DATE_RANGE ||
              question.type === QuestionType.DATE) && (
              <>
                <FormField
                  control={form.control}
                  name="fromDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-center justify-between space-x-1 rounded-lg py-3">
                      <div className="space-y-0.5">
                        <FormLabel>From Date Range</FormLabel>
                        <FormDescription>
                          Set the range of dates that can be selected.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <DatePicker
                          date={
                            field?.value ? new Date(field?.value) : undefined
                          }
                          onSelect={(date) => {
                            if (date) {
                              field.onChange(date.toISOString());
                              onSubmit({ fromDate: date.toISOString() });
                            } else {
                              field.onChange(date);
                              onSubmit({ fromDate: date });
                            }
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="toDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-center justify-between space-x-1 rounded-lg py-3">
                      <div className="space-y-0.5">
                        <FormLabel>To Date Range</FormLabel>
                        <FormDescription>
                          Set the range of dates that can be selected.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <DatePicker
                          date={
                            field?.value ? new Date(field?.value) : undefined
                          }
                          onSelect={(date) => {
                            // setToDate(date);
                            if (date) {
                              field.onChange(date.toISOString());
                              onSubmit({ toDate: date.toISOString() });
                            } else {
                              field.onChange(date);
                              onSubmit({ toDate: date });
                            }
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </>
            )}
            {/* <FormField
                control={form.control}
                name="security_emails"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Security emails</FormLabel>
                      <FormDescription>
                        Receive emails about your account security.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled
                        aria-readonly
                      />
                    </FormControl>
                  </FormItem>
                )}
              /> */}
          </div>
        </div>
      </form>
    </Form>
  );
}
