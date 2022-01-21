import prisma from "@/lib/prisma";

import type { NextApiRequest, NextApiResponse } from "next";

export default async function getSites(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { sessionId } = req.query;

  if (Array.isArray(sessionId))
    res.status(400).end("Bad request. sessionId parameter cannot be an array.");

  try {
    const sites = await prisma.site.findMany({
      where: {
        user: {
          id: sessionId as string,
        },
      },
    });

    res.status(200).json(sites);
  } catch (error) {
    console.error(error);
    res.status(500).end(error);
  }
}
