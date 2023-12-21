import React from 'react';
import { Answer } from "@prisma/client";
import { formatAnswer } from "@/components/form-response-table/utils";


interface ResponseModalProps {
  isOpen: boolean;
  onClose: () => void;
  rowData: { [key: string]: any } | null;
}

const ResponseModal: React.FC<ResponseModalProps> = ({ isOpen, onClose, rowData }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <div className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Full Response</h3>
          <div className="mt-2">
            {rowData && Object.entries(rowData).map(([key, value]) => (
              <p key={key} className="text-sm text-gray-500">{key}: {JSON.stringify(value)}</p>
            ))}
          </div>
          <div className="mt-4">
            <button
              type="button"
              className="inline-flex justify-center rounded-md border border-transparent bg-blue-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResponseModal;
