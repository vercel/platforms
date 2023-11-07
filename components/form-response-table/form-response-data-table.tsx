"use client";
import {
  Answer,
  Form,
  FormResponse,
  Prisma,
  Question,
  QuestionType,
  User,
} from "@prisma/client";
import DataTable from "./data-table";
import { Row } from "@tanstack/react-table";
import format from "date-fns/format";

function formatCalendarDay(time: string) {
    return format(new Date(time), 'MM/dd/yy')
}

function formatAnswer(q: Question, a?: Answer) {
  if (!a) {
    return "";
  }
  switch (q.type) {
    case QuestionType.SHORT_TEXT:
    case QuestionType.LONG_TEXT:
    case QuestionType.SELECT:
      return a.value?.toString();
    case QuestionType.BOOLEAN:
      return a.value ? "Yes" : "No";
    case QuestionType.DATE:
      return <div>{formatCalendarDay(a.value as string)}</div>
    case QuestionType.DATE_RANGE: {
      const dateRange = a.value as unknown as { to: string; from: string };
      return (
        <div>
          {formatCalendarDay(dateRange.from)}
          <br />
          {formatCalendarDay(dateRange.to)}
        </div>
      );
    }
  }
}

export default function FormResponseDataTable({
  formResponses,
  questions,
}: {
  questions: (Question & { form: Form })[];
  formResponses: (FormResponse & { answers: Answer[]; user: User })[];
}) {
  // Generate columns dynamically based on the structure of the form
  const columns = questions
    .sort((a, b) => a.order - b.order)
    .map((question) => ({
      header: question.text,
      accessorKey: question.id, // Use question id to create unique accessor
      cell: ({ row }: { row: Row<any> }) => {
        // const amount = parseFloat(row.getValue("amount"))
        // const formatted = new Intl.NumberFormat("en-US", {
        //   style: "currency",
        //   currency: "USD",
        // }).format(amount)

        const answer = row.getValue(question.id) as Answer;
        console.log("answer: ", answer);
        return (
          <div className="flex flex-wrap space-x-1">
            {formatAnswer(question, answer)}
          </div>
        );
      },
    }));

  // Generate data dynamically based on the form responses
  const data = formResponses.map((formResponse) => {
    const row: { [key: string]: any } = {
      id: formResponse.id,
      user: formResponse.user.name,
    };

    formResponse.answers.forEach((answer) => {
      row[answer.questionId] = answer;
    });

    return row;
  });
  return (
    <div className="p-6">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
