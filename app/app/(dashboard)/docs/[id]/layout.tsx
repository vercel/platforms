import { ReactNode } from "react";

export default function PostLayout({ children }: { children: ReactNode }) {
  return <div className="flex flex-col space-y-6 sm:p-10">{children}</div>;
}
