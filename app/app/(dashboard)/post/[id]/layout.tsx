import { ReactNode } from "react";

export default function PostLayout({ children }: { children: ReactNode }) {
  return <div className="sm:p-10 flex flex-col space-y-6">{children}</div>;
}
