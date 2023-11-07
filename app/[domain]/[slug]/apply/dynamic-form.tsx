"use client";
import { Form, Question, QuestionType } from "@prisma/client";
import React from "react";
import {
  Form as CustomForm,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/form-builder/date-picker";
import { DateRangePicker } from "@/components/form-builder/date-range-picker";
import { submitFormResponse } from "@/lib/actions";

function createDynamicSchema(orderedQuestions: Question[]) {
  const schema: Record<string, any> = {};

  orderedQuestions.forEach((question) => {
    switch (question.type) {
      case QuestionType.SHORT_TEXT:
      case QuestionType.LONG_TEXT:
        schema[question.id] = question.required
          ? z.string()
          : z.string().optional();
        break;
      case QuestionType.BOOLEAN:
        schema[question.id] = question.required
          ? z.boolean()
          : z.boolean().optional();
        break;
      case QuestionType.DATE:
        schema[question.id] = question.required
          ? z.string()
          : z.string().optional();
        break;
      case QuestionType.DATE_RANGE:
        schema[question.id] = question.required
          ? z.object({
              from: z.date().optional(),
              to: z.date().optional(),
            })
          : z
              .object({
                from: z.date().optional(),
                to: z.date().optional(),
              })
              .optional();
        break;
      case QuestionType.DROPDOWN:
      case QuestionType.SELECT:
      case QuestionType.MULTI_SELECT:
        schema[question.id] = question.required
          ? z.array(z.string())
          : z.array(z.string()).optional();
        break;
    }
  });

  return z.object(schema);
}
export function DynamicForm(props: { form: Form & { questions: Question[] } }) {
  const DynamicSchema = createDynamicSchema(props.form.questions);

  const form = useForm<z.infer<typeof DynamicSchema>>({
    resolver: zodResolver(createDynamicSchema(props.form.questions)),
  });

  async function onSubmit(data: z.infer<typeof DynamicSchema>) {
    // const variants = data.variants
    //   ? data.variants
    //       .split("\n")
    //       .map((variant) => ({ name: variant, value: variant }))
    //   : undefined;
    // submitFormResponse();
  }

  const orderedQuestions = props.form.questions.sort(
    (q1, q2) => q1.order - q2.order,
  );

  return (
    <CustomForm {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-6"
      >
        {orderedQuestions.map((question, index) => {
          switch (question.type) {
            case QuestionType.SHORT_TEXT:
              return (
                <FormField
                  control={form.control}
                  name={question.id}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{question.text}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              );
            case QuestionType.LONG_TEXT:
              return (
                <FormField
                  control={form.control}
                  name={question.id}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{question.text}</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              );
            case QuestionType.BOOLEAN:
              return (
                <FormField
                  control={form.control}
                  name={question.id}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{question.text}</FormLabel>
                      <FormControl>
                        <Checkbox
                          {...field}
                          onCheckedChange={(value) =>
                            form.setValue(question.id, value)
                          }
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              );
            case QuestionType.DROPDOWN:
            case QuestionType.SELECT:
            case QuestionType.MULTI_SELECT:
              return (
                <FormField
                  control={form.control}
                  name={question.id}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{question.text}</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={(value) =>
                            form.setValue(question.id, value)
                          }
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select an option" />
                          </SelectTrigger>
                          <SelectContent>
                            {(() => {
                              const variants =
                                (question?.variants as {
                                  name: string;
                                  value: string;
                                }[]) || undefined;
                              return (
                                variants?.map(
                                  (variant: {
                                    name: string;
                                    value: string;
                                  }) => {
                                    console.log("variant: ", variant);
                                    return (
                                      <SelectItem
                                        key={variant?.name}
                                        value={variant?.value}
                                      >
                                        {variant?.name}
                                      </SelectItem>
                                    );
                                  },
                                ) ?? undefined
                              );
                            })()}
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
              );
            case QuestionType.DATE:
              return (
                <FormField
                  control={form.control}
                  name={question.id}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{question.text}</FormLabel>
                      <FormControl>
                        <DatePicker
                          date={
                            field?.value ? new Date(field.value) : undefined
                          }
                          onSelect={(date) => {
                            form.setValue(question.id, date?.toISOString());
                          }}
                          fromDate={
                            question.fromDate ? question.fromDate : undefined
                          }
                          toDate={question.toDate ? question.toDate : undefined}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              );
            case QuestionType.DATE_RANGE:
              return (
                <FormField
                  control={form.control}
                  name={question.id}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{question.text}</FormLabel>
                      <FormControl>
                        <DateRangePicker
                          date={{
                            from: field?.value?.from
                              ? new Date(field.value.from)
                              : undefined,
                            to: field?.value?.to
                              ? new Date(field.value.to)
                              : undefined,
                          }}
                          onSelect={(date) => {
                            form.setValue(question.id, {
                              from: date?.from
                                ? new Date(date.from)
                                : new Date(),
                              to: date?.to ? new Date(date.to) : undefined,
                            });
                          }}
                          fromDate={
                            question.fromDate ? question.fromDate : undefined
                          }
                          toDate={question.toDate ? question.toDate : undefined}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              );
            default:
              return null;
          }
        })}
        <Button>Submit</Button>
      </form>
    </CustomForm>
  );
}

export default DynamicForm;
