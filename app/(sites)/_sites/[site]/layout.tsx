import Link from "next/link";
import Image from "next/image";
import { getSiteData } from "@/lib/fetchers";

import type { Meta } from "@/types";
import Banner from "./banner";
import Nav from "./nav";
import { ReactNode } from "react";

export default async function Layout({
  params,
  children,
}: {
  params: {
    site: string;
  };
  children: ReactNode;
}) {
  const { site } = params;
  const data = await getSiteData(site);
  const meta = {
    title: data.name,
    description: data.description,
    logo: "/logo.png",
    ogImage: data.image,
    ogUrl: data.customDomain
      ? data.customDomain
      : `https://${data.subdomain}.vercel.pub`,
  } as Meta;

  return (
    <div>
      <Nav>
        <div className="flex justify-center items-center space-x-5 h-full max-w-screen-xl mx-auto px-10 sm:px-20">
          <Link href="/" className="flex justify-center items-center">
            {meta?.logo && (
              <div className="h-8 w-8 inline-block rounded-full overflow-hidden align-middle">
                <Image
                  alt={meta?.title ?? "Logo"}
                  height={40}
                  src={meta?.logo}
                  width={40}
                />
              </div>
            )}
            <span className="inline-block ml-3 font-medium truncate">
              {meta?.title}
            </span>
          </Link>
        </div>
      </Nav>
      <div className="mt-20">{children}</div>
      <Banner subdomain="demo" />
    </div>
  );
}
