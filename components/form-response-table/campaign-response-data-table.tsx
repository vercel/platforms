"use client";
import {
  Answer,
  ApplicationStatus,
  Campaign,
  Form,
  FormResponse,
  Prisma,
  Question,
  QuestionType,
  User,
} from "@prisma/client";
import DataTable from "./data-table";
import { Row, RowData } from "@tanstack/react-table";
import { formatAnswer } from "./utils";
import { getUserCampaignApplication } from "@/lib/actions";
import test from "node:test";
import { useEffect, useState } from 'react';
import ResponseModal from '@/components/modal/view-response';


export default function CampaignResponseDataTable({
  campaign,
  formResponses,
  questions,
}: {
  campaign: Campaign;
  questions: (Question & { form: Form })[];
  formResponses: (FormResponse & { answers: Answer[]; user: User })[];
}) {
  const [data, setData] = useState<Row<any>[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Row<any> | null>(null);

  useEffect(() => {
    async function fetchCampaignApplications() {
      const updatedFormResponses = await Promise.all(
        formResponses.map(async (formResponse) => {
          const campaignApplication = await getUserCampaignApplication(
            campaign.id, formResponse.user.id);
          return {
            ...formResponse,
            status: campaignApplication!.status,
          };
        })
      );

      const formattedData = updatedFormResponses.map((formResponse) => {
        const row: { [key: string]: any } = {
          id: formResponse.id,
          user: formResponse.user.name,
          status: formResponse.status,
        };

        formResponse.answers.forEach((answer: Answer) => {
          row[answer.questionId] = answer;
        });

        return row as Row<any>;
      });

      setData(formattedData);
    }

    fetchCampaignApplications();
  }, [formResponses]);

  const handleRowClick = (row: Row<any>) => {
    setSelectedRow(row);
    setModalOpen(true);
  };

  const columns = questions
    .sort((a, b) => a.order - b.order)
    .map((question) => ({
      header: question.text,
      accessorKey: question.id, // Use question id to create unique accessor
      cell: ({ row }: { row: Row<any> }) => {
        const answer = row.getValue(question.id) as Answer;
        return (
          <div
            className="flex flex-wrap space-x-1 truncate max-w-[220px]"
            onClick={() => handleRowClick(row)}
          >
            {formatAnswer(question, answer)}
          </div>
        );
      },
    }));

  columns.push({
    header: "Status",
    accessorKey: "status",
    cell: ({ row }: { row: Row<any> }) => {
      const answer = row.getValue("status") as ApplicationStatus;
      return (
        <div className="flex flex-wrap space-x-1">
          {answer}
        </div>
      );
    },
  })

  return (
    <div className="mt-6">
      <DataTable columns={columns} data={data} />
      <ResponseModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        rowData={selectedRow ? selectedRow.original : null}
      />
    </div>
  );
}