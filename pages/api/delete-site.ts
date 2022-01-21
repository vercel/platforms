import prisma from "@/lib/prisma";

import type { NextApiRequest, NextApiResponse } from "next";

export default async function DeleteSite(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "DELETE") {
    res.setHeader("Allow", ["DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { siteId } = req.query;

  if (Array.isArray(siteId))
    res.status(400).end("Bad request. siteId parameter cannot be an array.");

  try {
    await Promise.all([
      prisma.post.deleteMany({
        where: {
          site: {
            id: siteId as string,
          },
        },
      }),
      prisma.site.delete({
        where: {
          id: siteId as string,
        },
      }),
    ]);

    res.status(200).end();
  } catch (error) {
    console.error(error);
    res.status(500).end(error);
  }
}
