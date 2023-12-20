import { ReactNode, Suspense } from "react";

import { notFound, redirect } from "next/navigation";
import { getSiteData } from "@/lib/fetchers";
import { fontMapper } from "@/styles/fonts";
import { Metadata } from "next";
import { cn } from "@/lib/utils";
import Drawer from "@/components/site-drawer";
import Profile from "@/components/profile";
// import Drawer from "@/components/drawer";

export async function generateMetadata({
  params,
}: {
  params: { domain: string };
}): Promise<Metadata | null> {
  const domain = params.domain.replace("%3A", ":");
  const data = await getSiteData(domain);
  if (!data) {
    return null;
  }
  const { name, title, description, image, logo } = data as {
    name: string;
    title?: string;
    description: string;
    image: string;
    logo: string;
  };

  return {
    title: title || name,
    description,
    openGraph: {
      title: title || name,
      description,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: title || name,
      description,
      images: [image],
      creator: "@vercel",
    },
    icons: [logo],
    metadataBase: new URL(`https://${domain}`),
  };
}

// export async function generateStaticParams() {
//   const [subdomains, customDomains] = await Promise.all([
//     prisma.organization.findMany({
//       select: {
//         subdomain: true,
//       },
//     }),
//     prisma.organization.findMany({
//       where: {
//         NOT: {
//           customDomain: null,
//         },
//       },
//       select: {
//         customDomain: true,
//       },
//     }),
//   ]);

//   const allPaths = [
//     ...subdomains.map(({ subdomain }) => subdomain),
//     ...customDomains.map(({ customDomain }) => customDomain),
//   ].filter((path) => path) as Array<string>;

//   return allPaths.map((domain) => ({
//     params: {
//       domain,
//     },
//   }));
// }

export default async function SiteLayout({
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

  return (
    <div className={cn(fontMapper[data.font], "min-h-screen")}>
      <Drawer>
        <Suspense fallback={<div>Loading...</div>}>
          <Profile />
        </Suspense>
      </Drawer>
      <div className="min-h-screen dark:bg-gray-900 md:pl-60 xl:pr-60">
        {children}
      </div>
    </div>
  );
}
