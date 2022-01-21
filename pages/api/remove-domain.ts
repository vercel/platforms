import prisma from "@/lib/prisma";

import type { NextApiRequest, NextApiResponse } from "next";

export default async function removeDomain(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "DELETE") {
    res.setHeader("Allow", ["DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { domain, siteId } = req.query;

  if (Array.isArray(domain) || Array.isArray(siteId))
    res.status(400).end("Bad request. Query parameters cannot be an array.");

  try {
    const response = await fetch(
      `https://api.vercel.com/v8/projects/${process.env.VERCEL_PROJECT_ID}/domains/${domain}?teamId=${process.env.VERCEL_TEAM_ID}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.AUTH_BEARER_TOKEN}`,
        },
        method: "DELETE",
      }
    );

    // TODO: Could do with some further checks
    await response.json();

    await prisma.site.update({
      where: {
        id: siteId as string,
      },
      data: {
        customDomain: null,
      },
    });

    res.status(200).end();
  } catch (error) {
    console.error(error);
    res.status(500).end(error);
  }
}
