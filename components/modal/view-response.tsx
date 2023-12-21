import React from 'react';
import { Button } from "@/components/ui/button";
import { respondToCampaignApplication } from "@/lib/actions";
import { Form, Question } from "@prisma/client";
import { formatAnswer } from "@/components/form-response-table/utils";


interface ResponseModalProps {
  isOpen: boolean;
  onClose: () => void;
  rowData: { [key: string]: any };
  questionsData: (Question & { form: Form })[];
}

const ResponseModal: React.FC<ResponseModalProps> = (
  { isOpen, onClose, rowData, questionsData }
) => {
  if (!isOpen) {
    return null;
  }

  const approveApplication = async () => {
    respondToCampaignApplication(rowData.applicationId, true);
  }

  const declineApplication = async () => {
    respondToCampaignApplication(rowData.applicationId, false);
  }

  let formattedRowData = (
    Object.entries(rowData)
      .filter(([key, value]) => value && typeof value === 'object' && 'questionId' in value)
      .map(([key, value]) => {
        const question = questionsData.find(q => q.id === value.questionId);
        const questionText = question!.text;

        return (
          <div key={key}>
            <h2 className="text-xl">{questionText}</h2>
            <p className="text-sm text-gray-200">{formatAnswer(question!, value)}</p>
          </div>
        );
      }
    )
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <div className="w-full max-w-md transform overflow-hidden rounded-2xl bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
          <div className="mt-2 flex flex-col space-y-6">
            {formattedRowData}
          </div>
          <div className="mt-4 flex justify-between">
            <Button
              onClick={() => {
                declineApplication();
                onClose();
              }}
            >
              Decline
            </Button>
            <Button
              onClick={onClose}
            >
              Skip
            </Button>
            <Button
              onClick={() => {
                approveApplication();
                onClose();
              }}
            >
              Approve
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResponseModal;
