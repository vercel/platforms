import cuid from "cuid";
import prisma from "@/lib/prisma";

import type { NextApiRequest, NextApiResponse } from "next";
import type { Site } from ".prisma/client";
import type { Session } from "next-auth";
import { placeholderBlurhash } from "../util";

/**
 * Get Site
 *
 * Fetches & returns either a single or all sites available depending on
 * whether a `siteId` query parameter is provided. If not all sites are
 * returned
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 * @param session - NextAuth.js session
 */
export async function getSite(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
): Promise<void | NextApiResponse<Array<Site> | (Site | null)>> {
  const { siteId } = req.query;

  if (Array.isArray(siteId))
    return res
      .status(400)
      .end("Bad request. siteId parameter cannot be an array.");

  if (!session.user.id)
    return res.status(500).end("Server failed to get session user ID");

  try {
    if (siteId) {
      const settings = await prisma.site.findFirst({
        where: {
          id: siteId,
          user: {
            id: session.user.id,
          },
        },
      });

      return res.status(200).json(settings);
    }

    const sites = await prisma.site.findMany({
      where: {
        user: {
          id: session.user.id,
        },
      },
    });

    return res.status(200).json(sites);
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}

/**
 * Create Site
 *
 * Creates a new site from a set of provided query parameters.
 * These include:
 *  - name
 *  - description
 *  - subdomain
 *  - userId
 *
 * Once created, the sites new `siteId` will be returned.
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 */
export async function createSite(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void | NextApiResponse<{
  siteId: string;
}>> {
  const { name, subdomain, description, userId } = req.body;

  const sub = subdomain.replace(/[^a-zA-Z0-9/-]+/g, "");

  try {
    const response = await prisma.site.create({
      data: {
        name: name,
        description: description,
        subdomain: sub.length > 0 ? sub : cuid(),
        logo: "/logo.png",
        image: `/placeholder.png`,
        imageBlurhash: placeholderBlurhash,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    return res.status(201).json({
      siteId: response.id,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}

/**
 * Delete Site
 *
 * Deletes a site from the database using a provided `siteId` query
 * parameter.
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 */
export async function deleteSite(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void | NextApiResponse> {
  const { siteId } = req.query;

  if (Array.isArray(siteId))
    return res
      .status(400)
      .end("Bad request. siteId parameter cannot be an array.");

  try {
    await prisma.$transaction([
      prisma.post.deleteMany({
        where: {
          site: {
            id: siteId,
          },
        },
      }),
      prisma.site.delete({
        where: {
          id: siteId,
        },
      }),
    ]);

    return res.status(200).end();
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}

/**
 * Update site
 *
 * Updates a site & all of its data using a collection of provided
 * query parameters. These include the following:
 *  - id
 *  - currentSubdomain
 *  - name
 *  - description
 *  - image
 *  - imageBlurhash
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 */
export async function updateSite(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void | NextApiResponse<Site>> {
  const { id, currentSubdomain, name, description, image, imageBlurhash } =
    req.body;

  const sub = req.body.subdomain.replace(/[^a-zA-Z0-9/-]+/g, "");
  const subdomain = sub.length > 0 ? sub : currentSubdomain;

  try {
    const response = await prisma.site.update({
      where: {
        id: id,
      },
      data: {
        name,
        description,
        subdomain,
        image,
        imageBlurhash,
      },
    });

    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}
