import prisma from "@/lib/prisma";

import type { NextApiRequest, NextApiResponse } from "next";

export default async function getPosts(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { siteId, published } = req.query;

  if (Array.isArray(siteId) || Array.isArray(published))
    res.status(400).end("Bad request. Query parameters cannot be an array.");

  const posts = await prisma.post.findMany({
    where: {
      site: {
        id: siteId as string,
      },
      published: JSON.parse(published as string),
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  const site = await prisma.site.findFirst({
    where: {
      id: siteId as string,
    },
  });

  res.status(200).json({ posts, site });
}
