import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import SiteCard from "./site-card";
import Image from "next/image";
import db from "@/lib/db/db";
import { sites, users } from "@/lib/db/schema";
import { asc, eq, getTableColumns } from "drizzle-orm";
import { withLimit } from "@/lib/utils";

export default async function Sites({ limit }: { limit?: number }) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  const query = db
    .select({
      ...getTableColumns(sites),
    })
    .from(sites)
    .leftJoin(users, eq(sites.userId, users.id))
    .where(eq(users.id, session.user.id))
    .orderBy(asc(sites.createdAt));

  const sitesResult = limit
    ? await withLimit(query.$dynamic(), limit)
    : await query;

  return sitesResult.length > 0 ? (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {sitesResult.map((site) => (
        <SiteCard key={site.id} data={site} />
      ))}
    </div>
  ) : (
    <div className="mt-20 flex flex-col items-center space-x-4">
      <h1 className="font-cal text-4xl">No Sites Yet</h1>
      <Image
        alt="missing site"
        src="https://illustrations.popsy.co/gray/web-design.svg"
        width={400}
        height={400}
      />
      <p className="text-lg text-stone-500">
        You do not have any sites yet. Create one to get started.
      </p>
    </div>
  );
}
