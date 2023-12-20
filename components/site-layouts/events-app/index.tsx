import { ReactNode, Suspense } from "react";

import { notFound, redirect } from "next/navigation";
import { getSiteData } from "@/lib/fetchers";
import { fontMapper } from "@/styles/fonts";
import { Metadata } from "next";
import { cn } from "@/lib/utils";
import Drawer from "@/components/site-drawer";
import Profile from "@/components/profile";

export default async function EventsAppLayout({
  params,
  children,
}: {
  params: { domain: string };
  children: ReactNode;
}) {
  const domain = params.domain.replace("%3A", ":");
  const data = await getSiteData(domain);

  if (!data) {
    return notFound();
  }

  // Optional: Redirect to custom domain if it exists
  if (
    domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) &&
    data.customDomain &&
    process.env.REDIRECT_TO_CUSTOM_DOMAIN_IF_EXISTS === "true"
  ) {
    return redirect(`https://${data.customDomain}`);
  }

  // return (
  //   <div className={cn(fontMapper[data.font], "min-h-screen")}>
  //     <Drawer></Drawer>
  //     <div className="min-h-screen dark:bg-gray-900 sm:pl-60 xl:pr-60">
  //       {children}
  //     </div>
  //   </div>
  // );

  return (
    <div className={cn(fontMapper[data.font], "min-h-screen")}>
      <Drawer>
        <Suspense fallback={<div>Loading...</div>}>
          <Profile />
        </Suspense>
      </Drawer>
      <div className="min-h-screen dark:bg-gray-900 sm:pl-60 xl:pr-60">
        {children}
      </div>
    </div>
  );
}
