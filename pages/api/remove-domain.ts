import prisma from "@/lib/prisma";

import type { NextApiRequest, NextApiResponse } from "next";

export default async function removeDomain(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { domain, siteId } = req.query;

  if (Array.isArray(domain) || Array.isArray(siteId))
    res.status(400).end("Bad request. Query parameters cannot be an array.");

  const response = await fetch(
    `https://api.vercel.com/v8/projects/${process.env.VERCEL_PROJECT_ID}/domains/${domain}?teamId=${process.env.VERCEL_TEAM_ID}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.AUTH_BEARER_TOKEN}`,
      },
      method: "DELETE",
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

  res.status(200).end();
}
