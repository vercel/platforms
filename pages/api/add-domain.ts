import prisma from "@/lib/prisma";
import { HttpMethod } from "@/types";

import type { NextApiRequest, NextApiResponse } from "next";

export default async function addDomain(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== HttpMethod.POST) {
    res.setHeader("Allow", [HttpMethod.POST]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { domain, siteId } = req.query;

  if (Array.isArray(domain) || Array.isArray(siteId))
    return res.status(400).end("Bad request. Query parameters are not valid.");

  try {
    const response = await fetch(
      `https://api.vercel.com/v8/projects/${process.env.VERCEL_PROJECT_ID}/domains?teamId=${process.env.VERCEL_TEAM_ID}`,
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

    if (data.error?.code == "forbidden") {
      res.status(403).end(); // domain is already owned by another team but you can request delegation to access it
    } else if (data.error?.code == "domain_taken") {
      res.status(409).end(); // domain is already being used by a different project
    } else {
      // domain is successfully added
      await prisma.site.update({
        where: {
          id: siteId,
        },
        data: {
          customDomain: domain,
        },
      });
      res.status(200).end();
    }
  } catch (error) {
    console.error(error);
    res.status(500).end(error);
  }
}
