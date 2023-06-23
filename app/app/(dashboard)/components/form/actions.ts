"use server";

import prisma from "@/lib/prisma";
import { Site } from "@prisma/client";
import { revalidateTag } from "next/cache";
import { withSiteAuth } from "./auth";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export const editSite = withSiteAuth(
  async (formData: FormData, site: Site, key: string) => {
    const value = formData.get(key) as string;

    try {
      const response = await prisma.site.update({
        where: {
          id: site.id,
        },
        data: {
          [key]: value,
        },
      });

      revalidateTag(`${site.subdomain}-metadata`);
      revalidateTag(`${site.customDomain}-metadata`);

      return response;
    } catch (error: any) {
      if (error.code === "P2002") {
        throw new Error(`This ${key} is already taken`);
      } else {
        throw Error(error);
      }
    }
  }
);

export const editUser = async (
  formData: FormData,
  _id: unknown,
  key: string
) => {
  const session = await getServerSession(authOptions);
  if (!session?.user.id) {
    throw new Error("Not authenticated");
  }
  const value = formData.get(key) as string;

  try {
    const response = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        [key]: value,
      },
    });
    return response;
  } catch (error: any) {
    if (error.code === "P2002") {
      throw new Error(`This ${key} is already in use`);
    } else {
      throw Error(error);
    }
  }
};
