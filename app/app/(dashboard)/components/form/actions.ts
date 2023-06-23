"use server";

import prisma from "@/lib/prisma";
import { Site } from "@prisma/client";
import { revalidateTag } from "next/cache";
import { withSiteAuth } from "./auth";

export const editSite = withSiteAuth(
  async (formData: FormData, site: Site, key: string) => {
    const value = formData.get(key) as string;

    await prisma.site.update({
      where: {
        id: site.id,
      },
      data: {
        [key]: value,
      },
    });

    revalidateTag(`${site.subdomain}-metadata`);
    revalidateTag(`${site.customDomain}-metadata`);

    return {
      success: true,
    };
  }
);
