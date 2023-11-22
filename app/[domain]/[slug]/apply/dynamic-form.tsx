"use client";
import { Form, Question, QuestionType } from "@prisma/client";
import { useMemo } from "react";
import {
  Form as CustomForm,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
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
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function createDynamicSchema(orderedQuestions: Question[]) {
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
          ? z.date()
          : z.date().optional();
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
        schema[question.id] = question.required
          ? z.string()
          : z.string().optional();
        break;
      case QuestionType.MULTI_SELECT:
        schema[question.id] = question.required
          ? z.array(z.string())
          : z.array(z.string()).optional();
        break;
    }
  });

  return z.object(schema);
}

export const DynamicFormLabel = ({ children }: { children: string }) => {
  return <FormLabel className="text-lg font-semibold">{children}</FormLabel>;
};

export const DynamicFormDesc = ({ children }: { children: string }) => {
  return <p className="text-md text-gray-750 dark:text-gray-300">{children}</p>;
};

export function DynamicForm(props: { form: Form & { questions: Question[] } }) {
  const orderedQuestions = useMemo(
    () => props.form.questions.sort((q1, q2) => q1.order - q2.order),
    [props.form.questions],
  );
  const DynamicSchema = useMemo(
    () => createDynamicSchema(orderedQuestions),
    [orderedQuestions],
  );

  const form = useForm<z.infer<typeof DynamicSchema>>({
    resolver: zodResolver(createDynamicSchema(orderedQuestions)),
  });
  const router = useRouter();

  async function onSubmit(data: z.infer<typeof DynamicSchema>) {
    const formattedData = Object.entries(data).map(([questionId, value]) => ({
      questionId,
      value,
    }));

    const response = await submitFormResponse(props.form.id, formattedData);
    if ("error" in response) {
      // TODO:// handle this error
      toast.error(response.error);
      return;
    }
    if ("id" in response) {
      toast.success("Successfully submitted respone to " + props.form.name);
      router.refresh();
    }
  }

  return (
    <CustomForm {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
        {orderedQuestions.map((question) => {
          switch (question.type) {
            case QuestionType.SHORT_TEXT:
              return (
                <FormField
                  key={question.id}
                  control={form.control}
                  name={question.id}
                  render={({ field }) => (
                    <FormItem>
                      <DynamicFormLabel>{question.text}</DynamicFormLabel>
                      <span>{question.required ? " *" : ""}</span>
                      {question.description ? (
                        <DynamicFormDesc>
                          {question.description}
                        </DynamicFormDesc>
                      ) : null}
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              );
            case QuestionType.LONG_TEXT:
              return (
                <FormField
                  key={question.id}
                  control={form.control}
                  name={question.id}
                  render={({ field }) => (
                    <FormItem>
                      <DynamicFormLabel>{question.text}</DynamicFormLabel>
                      <span>{question.required ? "*" : ""}</span>
                      {question.description ? (
                        <DynamicFormDesc>
                          {question.description}
                        </DynamicFormDesc>
                      ) : null}

                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              );
            case QuestionType.BOOLEAN:
              return (
                <FormField
                  key={question.id}
                  control={form.control}
                  name={question.id}
                  render={({ field }) => (
                    <FormItem>
                      <DynamicFormLabel>{question.text}</DynamicFormLabel>
                      <span>{question.required ? "*" : ""}</span>
                      {question.description ? (
                        <DynamicFormDesc>
                          {question.description}
                        </DynamicFormDesc>
                      ) : null}

                      <br />
                      <div className="flex items-center">
                        <FormControl>
                          <Checkbox
                            className="ml-1"
                            {...field}
                            value={field.value}
                            onCheckedChange={(value) =>
                              form.setValue(question.id, value)
                            }
                          ></Checkbox>
                        </FormControl>
                        <span className="mb-0.5 ml-1.5">Yes</span>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              );
            case QuestionType.DROPDOWN:
            case QuestionType.SELECT:
              return (
                <FormField
                  key={question.id}
                  control={form.control}
                  name={question.id}
                  render={({ field }) => (
                    <FormItem>
                      <DynamicFormLabel>{question.text}</DynamicFormLabel>
                      <span>{question.required ? "*" : ""}</span>
                      {question.description ? (
                        <DynamicFormDesc>
                          {question.description}
                        </DynamicFormDesc>
                      ) : null}

                      <FormControl>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                          }}
                          defaultValue={field.value}
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
                                    return (
                                      <SelectItem
                                        key={variant.value}
                                        value={variant.value}
                                      >
                                        {variant.value}
                                      </SelectItem>
                                    );
                                  },
                                ) ?? undefined
                              );
                            })()}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormControl>
                    </FormItem>
                  )}
                />
              );
            case QuestionType.DATE:
              return (
                <FormField
                  key={question.id}
                  control={form.control}
                  name={question.id}
                  render={({ field }) => (
                    <FormItem>
                      <DynamicFormLabel>{question.text}</DynamicFormLabel>
                      <span>{question.required ? "*" : ""}</span>
                      {question.description ? (
                        <DynamicFormDesc>
                          {question.description}
                        </DynamicFormDesc>
                      ) : null}

                      <FormControl>
                        <DatePicker
                          date={
                            field?.value ? new Date(field.value) : undefined
                          }
                          onSelect={(date) => {
                            form.setValue(question.id, date);
                          }}
                          fromDate={
                            question.fromDate ? question.fromDate : undefined
                          }
                          toDate={question.toDate ? question.toDate : undefined}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              );
            case QuestionType.DATE_RANGE:
              return (
                <FormField
                  key={question.id}
                  control={form.control}
                  name={question.id}
                  render={({ field }) => (
                    <FormItem>
                      <DynamicFormLabel>{question.text}</DynamicFormLabel>
                      <span>{question.required ? "*" : ""}</span>
                      {question.description ? (
                        <DynamicFormDesc>
                          {question.description}
                        </DynamicFormDesc>
                      ) : null}

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
                      <FormMessage />
                    </FormItem>
                  )}
                />
              );
            default:
              return null;
          }
        })}
        <Button type="submit">Submit</Button>
      </form>
    </CustomForm>
  );
}

export default DynamicForm;
