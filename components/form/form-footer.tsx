import { ReactNode } from "react";

export default function FormFooter({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center justify-end rounded-b-lg border-t border-gray-700 bg-gray-200 p-3 dark:border-gray-700 dark:bg-gray-800 md:px-10">
      {children}
    </div>
  );
}
