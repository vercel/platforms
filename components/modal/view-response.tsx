import React from 'react';
import { Button } from "@/components/ui/button";
import { respondToCampaignApplication } from "@/lib/actions";


interface ResponseModalProps {
  isOpen: boolean;
  onClose: () => void;
  rowData: { [key: string]: any };
}

const ResponseModal: React.FC<ResponseModalProps> = (
  { isOpen, onClose, rowData }
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

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <div className="w-full max-w-md transform overflow-hidden rounded-2xl bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
          <h3 className="text-lg font-medium leading-6 text-gray-200">Full Response</h3>
          <div className="mt-2">
            {rowData && Object.entries(rowData).map(([key, value]) => (
              <p key={key} className="text-sm text-gray-200">{key}: {JSON.stringify(value)}</p>
            ))}
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
