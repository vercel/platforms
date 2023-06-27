"use server";

import prisma from "@/lib/prisma";
import { Site } from "@prisma/client";
import { revalidateTag } from "next/cache";
import { withSiteAuth } from "./auth";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import {
  addDomainToVercel,
  getApexDomain,
  removeDomainFromVercelProject,
  removeDomainFromVercelTeam,
  validDomainRegex,
} from "@/lib/domains";

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
      let response;

      if (key === "customDomain") {
        if (value.includes("vercel.pub")) {
          throw Error("Cannot use vercel.pub subdomain as your custom domain");

          // if the custom domain is valid, we need to add it to Vercel
        } else if (validDomainRegex.test(value)) {
          response = await prisma.site.update({
            where: {
              id: site.id,
            },
            data: {
              customDomain: value,
            },
          });
          await addDomainToVercel(value);

          // empty value means the user wants to remove the custom domain
        } else if (value === "") {
          response = await prisma.site.update({
            where: {
              id: site.id,
            },
            data: {
              customDomain: null,
            },
          });
        }

        // if the site had a customDomain before, we need to remove it from Vercel
        if (site.customDomain) {
          // first, we need to check if the apex domain is being used by other sites
          const apexDomain = getApexDomain(`https://${site.customDomain}`);
          const domainCount = await prisma.site.count({
            where: {
              OR: [
                {
                  customDomain: apexDomain,
                },
                {
                  customDomain: {
                    endsWith: `.${apexDomain}`,
                  },
                },
              ],
            },
          });

          // if the apex domain is being used by other sites
          // we should only remove it from our Vercel project
          if (domainCount >= 1) {
            await removeDomainFromVercelProject(site.customDomain);
          } else {
            // this is the only site using this apex domain
            // so we can remove it entirely from our Vercel team
            await removeDomainFromVercelTeam(site.customDomain);
          }
        }
      } else {
        response = await prisma.site.update({
          where: {
            id: site.id,
          },
          data: {
            [key]: value,
          },
        });
      }

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
