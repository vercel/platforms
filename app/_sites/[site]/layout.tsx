import Link from "next/link";
import Image from "next/image";
import { getSiteData } from "@/lib/fetchers";
import Banner from "./banner";
import Nav from "./nav";
import { ReactNode } from "react";
import { fontMapper } from "@/styles/fonts";

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

  return (
    <div className={fontMapper[data.font]}>
      <Nav>
        <div className="flex justify-center items-center space-x-5 h-full max-w-screen-xl mx-auto px-10 sm:px-20">
          <Link href="/" className="flex justify-center items-center">
            <div className="h-8 w-8 inline-block rounded-full overflow-hidden align-middle">
              <Image alt="Logo" height={40} src="/logo.png" width={40} />
            </div>
            <span className="font-title inline-block ml-3 font-medium truncate">
              {data.name}
            </span>
          </Link>
        </div>
      </Nav>
      <div className="mt-20">{children}</div>
      <Banner subdomain="demo" />
    </div>
  );
}
