import Image from "next/image";
import Link from "next/link";
import { ReactNode, Suspense } from "react";
import { getSiteData } from "@/lib/fetchers";
import UserNav from "./user-nav";
import dynamic from "next/dynamic";

const ConnectEthButton = dynamic(
  () => import("@/components/connect-eth-button"),
  {
    ssr: false,
  },
);

export default async function SiteNav({
  params,
}: {
  params: { domain: string };
}) {
  const domain = params.domain.replace("%3A", ":");
  const data = await getSiteData(domain);

  return (
    <>
      <nav className="ease fixed left-0 right-0 top-0 z-30 flex h-16  bg-gray-100/50 backdrop-blur-xl transition-all duration-150 dark:border-b-0 dark:border-gray-700 dark:bg-gray-900/60">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-center px-2.5">
          <div className="flex">
            <Link href="/" className="flex items-center justify-center">
              {/* <div className="relative h-8 w-8">
                <Image
                  alt={data?.name || ""}
                  src={data?.logo || ""}
                  layout="fill"
                />
              </div> */}
              <span className="ml-3 inline-block truncate font-title font-medium">
                {/* {data?.name} */}
              </span>
            </Link>
          </div>
          <div className="absolute right-1 top-1 p-2.5">
            <UserNav />
          </div>
        </div>
      </nav>
      <div className="h-16 w-full"></div>
    </>
  );
}
