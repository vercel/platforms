import { ReactNode, Suspense } from "react";
import Profile from "@/components/profile";
import Drawer from "@/components/drawer";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <Drawer>
        <Suspense fallback={<div>Loading...</div>}>
          <Profile />
        </Suspense>
      </Drawer>
      <div className="min-h-screen dark:bg-brand-gray900 sm:pl-60">{children}</div>
    </div>
  );
}
