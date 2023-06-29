import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import prisma from "@/lib/prisma";
import CTA from "./cta";
import { notFound, redirect } from "next/navigation";
import { getSiteData } from "@/lib/fetchers";
import { fontMapper } from "@/styles/fonts";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { domain: string };
}): Promise<Metadata> {
  const data = await getSiteData(params.domain);
  if (!data) {
    notFound();
  }
  const {
    name: title,
    description,
    image,
    logo,
  } = data as {
    name: string;
    description: string;
    image: string;
    logo: string;
  };

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@vercel",
    },
    icons: [logo],
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
      where: {
        NOT: {
          customDomain: null,
        },
      },
      select: {
        customDomain: true,
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
  params,
  children,
}: {
  params: { domain: string };
  children: ReactNode;
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
      <div className="top-0 left-0 right-0 h-16 bg-white z-30 transition-all ease duration-150 flex">
        <div className="flex justify-center items-center space-x-5 h-full max-w-screen-xl mx-auto px-10 sm:px-20">
          <Link href="/" className="flex justify-center items-center">
            <div className="h-8 w-8 inline-block rounded-full overflow-hidden align-middle">
              <Image
                alt={data.name || ""}
                height={40}
                src={data.logo || ""}
                width={40}
              />
            </div>
            <span className="inline-block font-title ml-3 font-medium truncate">
              {data.name}
            </span>
          </Link>
        </div>
      </div>

      <div className="mt-20">{children}</div>

      {params.domain == `demo.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}` && (
        <CTA />
      )}
    </div>
  );
}
