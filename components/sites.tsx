import Image from "next/image";
import { redirect } from "next/navigation";

import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

import SiteCard from "./site-card";

export default async function Sites({ limit }: { limit?: number }) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  const sites = await prisma.site.findMany({
    orderBy: {
      createdAt: "asc",
    },
    where: {
      user: {
        id: session.user.id as string,
      },
    },
    ...(limit ? { take: limit } : {}),
  });

  return sites.length > 0 ? (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {sites.map((site) => (
        <SiteCard data={site} key={site.id} />
      ))}
    </div>
  ) : (
    <div className="mt-20 flex flex-col items-center space-x-4">
      <h1 className="font-cal text-4xl">No Sites Yet</h1>
      <Image
        alt="missing site"
        height={400}
        src="https://illustrations.popsy.co/gray/web-design.svg"
        width={400}
      />
      <p className="text-lg text-stone-500">
        You do not have any sites yet. Create one to get started.
      </p>
    </div>
  );
}
