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
import { Form as FormType, Question } from "@prisma/client";
import { QuestionDataInputUpdate } from "@/lib/actions";
import { useEffect } from "react";

const QuestionSettingsSchema = z.object({
  required: z.boolean().default(false).optional(),
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
    defaultValues: {
      required: false,
    },
  });

  useEffect(() => {
    form?.setValue('required', question.required);
  }, [form, question])

  async function onSubmit(data: z.infer<typeof QuestionSettingsSchema>) {
    handleUpdateQuestion(question.id, { id: question.id, ...data });
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
