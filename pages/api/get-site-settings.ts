import prisma from "@/lib/prisma";

import type { NextApiRequest, NextApiResponse } from "next";

export default async function getSiteSettings(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { siteId } = req.query;

  if (Array.isArray(siteId))
    res.status(400).end("Bad request. siteId parameter cannot be an array.");

  const settings = await prisma.site.findUnique({
    where: {
      id: siteId as string,
    },
  });
  res.status(200).json(settings);
}
