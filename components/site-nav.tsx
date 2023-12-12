import Image from "next/image";
import Link from "next/link";
// import { ReactNode, Suspense } from "react";
// import { getSiteData } from "@/lib/fetchers";
import UserNav from "./user-nav";
// import dynamic from "next/dynamic";
// import ConnectPassportButton from "./buttons/ConnectPassportButton";

// const ConnectEthButton = dynamic(
//   () => import("@/components/connect-eth-button"),
//   {
//     ssr: false,
//   },
// );

export default async function SiteNav({
  params,
}: {
  params: { domain: string };
}) {
  // const domain = params.domain.replace("%3A", ":");
  // const data = await getSiteData(domain);

  return (
    <>
      <nav className="ease fixed left-0 right-0 top-0 z-30 flex h-16  bg-gray-100/50 backdrop-blur-xl transition-all duration-150 dark:border-b-0 dark:border-gray-700 dark:bg-gray-900/60">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-center px-2.5">
          <Link
            href={
              process.env.NEXT_PUBLIC_ROOT_DOMAIN === "localhost:3000"
                ? `http://${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`
                : `https://${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`
            }
            className="absolute left-1 p-2.5"
          >
            <Image
              alt={"Fora logo"}
              src={"https://fora.co/fora-logo.png"}
              height={24}
              width={24}
            />
          </Link>
          <div className="flex">
            {/* <ConnectPassportButton className='h-9'>Connect Passport</ConnectPassportButton> */}
          </div>
          <div className="absolute right-1 p-2.5">
            <UserNav />
          </div>
        </div>
      </nav>
      <div className="h-16 w-full"></div>
    </>
  );
}
