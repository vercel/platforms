import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import CreateSiteButton from "./create-site-button";
import CreateSiteModal from "./modal/create-site";
import Link from "next/link";

export default async function OverviewSitesCTA() {
  const session = await getSession();
  if (!session) {
    return 0;
  }
  const sites = await prisma.site.count({
    where: {
      userId: session.user.id as string,
    },
  });

  return sites > 0 ? (
    <Link
      href="/sites"
      className="font-medium text-sm px-4 py-1.5 rounded-lg border border-black bg-black hover:bg-white text-white hover:text-black active:bg-stone-100 transition-all"
    >
      View All Sites
    </Link>
  ) : (
    <CreateSiteButton>
      <CreateSiteModal />
    </CreateSiteButton>
  );
}
