import prisma from "@/lib/prisma";
import { HttpMethod } from "@/types";

import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Add Domain
 *
 * Adds a new domain to the Vercel project using a provided
 * `domain` & `siteId` query parameters
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 */
export async function createDomain(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void | NextApiResponse> {
  const { domain, siteId } = req.query;

  if (Array.isArray(domain) || Array.isArray(siteId))
    return res.status(400).end("Bad request. Query parameters are not valid.");

  try {
    const response = await fetch(
      `https://api.vercel.com/v8/projects/${process.env.PROJECT_ID_VERCEL}/domains?teamId=${process.env.TEAM_ID_VERCEL}`,
      {
        body: `{\n  "name": "${domain}"\n}`,
        headers: {
          Authorization: `Bearer ${process.env.AUTH_BEARER_TOKEN}`,
          "Content-Type": "application/json",
        },
        method: HttpMethod.POST,
      }
    );

    const data = await response.json();

    // Domain is already owned by another team but you can request delegation to access it
    if (data.error?.code === "forbidden") return res.status(403).end();

    // Domain is already being used by a different project
    if (data.error?.code === "domain_taken") return res.status(409).end();

    // Domain is successfully added
    await prisma.site.update({
      where: {
        id: siteId,
      },
      data: {
        customDomain: domain,
      },
    });

    return res.status(200).end();
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}

/**
 * Delete Domain
 *
 * Remove a domain from the vercel project using a provided
 * `domain` & `siteId` query parameters
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 */
export async function deleteDomain(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void | NextApiResponse> {
  const { domain, siteId } = req.query;

  if (Array.isArray(domain) || Array.isArray(siteId))
    res.status(400).end("Bad request. Query parameters cannot be an array.");

  try {
    const response = await fetch(
      `https://api.vercel.com/v6/domains/${domain}?teamId=${process.env.TEAM_ID_VERCEL}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.AUTH_BEARER_TOKEN}`,
        },
        method: HttpMethod.DELETE,
      }
    );

    await response.json();

    await prisma.site.update({
      where: {
        id: siteId as string,
      },
      data: {
        customDomain: null,
      },
    });

    return res.status(200).end();
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}
