"use server";

import prisma from "@/lib/prisma";
import { Site } from "@prisma/client";
import { revalidateTag } from "next/cache";
import { withSiteAuth } from "./auth";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export const createSite = async (formData: FormData) => {
  const session = await getServerSession(authOptions);
  if (!session?.user.id) {
    throw new Error("Not authenticated");
  }
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const subdomain = formData.get("subdomain") as string;

  try {
    const response = await prisma.site.create({
      data: {
        name,
        description,
        subdomain,
        user: {
          connect: {
            id: session.user.id,
          },
        },
      },
    });
    return response;
  } catch (error: any) {
    if (error.code === "P2002") {
      throw new Error(`This subdomain is already taken`);
    } else {
      throw Error(error);
    }
  }
};

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

export const deleteSite = withSiteAuth(async (_: FormData, site: Site) => {
  try {
    const response = await prisma.site.delete({
      where: {
        id: site.id,
      },
    });
    return response;
  } catch (error: any) {
    throw Error(error);
  }
});

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
