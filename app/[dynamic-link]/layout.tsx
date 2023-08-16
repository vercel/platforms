import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ReactNode } from "react";

import CTA from "@/components/cta";
import ReportAbuse from "@/components/report-abuse";
import { getSiteData } from "@/lib/fetchers";
import prisma from "@/lib/prisma";
import { fontMapper } from "@/styles/fonts";

export async function generateMetadata({
  params,
}: {
  params: { domain: string };
}): Promise<Metadata | null> {
  const data = await getSiteData(params.domain);
  if (!data) {
    return null;
  }
  const {
    description,
    image,
    logo,
    name: title,
  } = data as {
    description: string;
    image: string;
    logo: string;
    name: string;
  };

  return {
    description,
    icons: [logo],
    metadataBase: new URL(`https://${params.domain}`),
    openGraph: {
      description,
      images: [image],
      title,
    },
    title,
    twitter: {
      card: "summary_large_image",
      creator: "@vercel",
      description,
      images: [image],
      title,
    },
  };
}

export async function generateStaticParams() {
  const [subdomains, customDomains] = await Promise.all([
    prisma.site.findMany({
      select: {
        subdomain: true,
      },
    }),
    prisma.site.findMany({
      select: {
        customDomain: true,
      },
      where: {
        NOT: {
          customDomain: null,
        },
      },
    }),
  ]);

  const allPaths = [
    ...subdomains.map(({ subdomain }) => subdomain),
    ...customDomains.map(({ customDomain }) => customDomain),
  ].filter((path) => path) as Array<string>;

  return allPaths.map((domain) => ({
    params: {
      domain,
    },
  }));
}

export default async function SiteLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { domain: string };
}) {
  const { domain } = params;
  const data = await getSiteData(domain);

  if (!data) {
    notFound();
  }

  // Optional: Redirect to custom domain if it exists
  if (
    domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) &&
    data.customDomain &&
    process.env.REDIRECT_TO_CUSTOM_DOMAIN_IF_EXISTS === "true"
  ) {
    return redirect(`https://${data.customDomain}`);
  }

  return (
    <div className={fontMapper[data.font]}>
      <div className="ease inset-x-0 top-0 z-30 flex h-16 bg-white transition-all duration-150 dark:bg-black dark:text-white">
        <div className="mx-auto flex h-full max-w-screen-xl items-center justify-center space-x-5 px-10 sm:px-20">
          <Link className="flex items-center justify-center" href="/">
            <div className="inline-block h-8 w-8 overflow-hidden rounded-full align-middle">
              <Image
                alt={data.name || ""}
                height={40}
                src={data.logo || ""}
                width={40}
              />
            </div>
            <span className="ml-3 inline-block truncate font-title font-medium">
              {data.name}
            </span>
          </Link>
        </div>
      </div>

      <div className="mt-20">{children}</div>

      {params.domain == `demo.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}` ||
      params.domain == `platformize.co` ? (
        <CTA />
      ) : (
        <ReportAbuse />
      )}
    </div>
  );
}
