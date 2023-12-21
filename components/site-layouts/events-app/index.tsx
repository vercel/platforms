import { ReactNode, Suspense } from "react";

import Drawer from "@/components/site-drawer";
import Profile from "@/components/profile";
import { getSession } from "@/lib/auth";

export default async function EventsAppLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getSession();
  // return (
  //   <div className={cn(fontMapper[data.font], "min-h-screen")}>
  //     <Drawer></Drawer>
  //     <div className="min-h-screen dark:bg-gray-900 sm:pl-60 xl:pr-60">
  //       {children}
  //     </div>
  //   </div>
  // );

  if (session?.user.id) {
    return (
      <>
        <Drawer>
          <Suspense fallback={<div>Loading...</div>}>
            <Profile />
          </Suspense>
        </Drawer>
        <div className="min-h-screen dark:bg-gray-900 sm:pl-60">
          {children}
        </div>
      </>
    );
  }

  return <div className="min-h-screen w-full dark:bg-gray-900 mx-auto max-w-5xl">{children}</div>;
}
