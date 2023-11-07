import { FormResponse } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";

export type FormResponseWithAnswers = FormResponse & { answers: { question: string, value: string }[] };

export const columns: ColumnDef<FormResponseWithAnswers>[] = [
  {
    accessorKey: "user.name",
    header: "User",
  },
  {
    accessorKey: "answers",
    header: "Answers",
    cell: ({ row }) => {
      const answers = row.getValue("answers") as { question: string, value: string }[];
      return (
        <div>
          {answers.map((answer, index) => (
            <div key={index}>
              <strong>{answer.question}: </strong> {answer.value}
            </div>
          ))}
        </div>
      );
    },
  },
];