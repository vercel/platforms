import { ReactNode } from "react";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="p-8 flex flex-col space-y-12 max-w-screen-xl">
      <div className="flex flex-col space-y-6">{children}</div>
    </div>
  );
}
