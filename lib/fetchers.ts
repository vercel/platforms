import { cache } from "react";
import type { _SiteData } from "@/types";
import prisma from "@/lib/prisma";

export const getSiteData = cache(async (site: string): Promise<_SiteData> => {
  let filter: {
    subdomain?: string;
    customDomain?: string;
  } = {
    subdomain: site,
  };

  if (site.includes(".")) {
    filter = {
      customDomain: site,
    };
  }

  const data = (await prisma.site.findUnique({
    where: filter,
    include: {
      user: true,
      posts: {
        where: {
          published: true,
        },
        orderBy: [
          {
            createdAt: "desc",
          },
        ],
      },
    },
  })) as _SiteData;

  return data;
});
