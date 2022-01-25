import prisma from "@/lib/prisma";
import { HttpMethod } from "@/types";

import type { NextApiRequest, NextApiResponse } from "next";

export default async function checkSubdomain(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== HttpMethod.GET) {
    res.setHeader("Allow", [HttpMethod.GET]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { subdomain } = req.query;

  if (Array.isArray(subdomain))
    res.status(400).end("Bad request. subdomain parameter cannot be an array.");

  const sub = (subdomain as string).replace(/[^a-zA-Z0-9/-]+/g, "");

  try {
    const data = await prisma.site.findUnique({
      where: {
        subdomain: sub,
      },
    });

    const available = data === null && sub.length !== 0;

    res.status(200).json(available);
  } catch (error) {
    console.error(error);
    res.status(500).end(error);
  }
}
