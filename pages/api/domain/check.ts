import prisma from "@/lib/prisma";
import { HttpMethod } from "@/types";

import type { NextApiRequest, NextApiResponse } from "next";

export default async function post(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== HttpMethod.GET) {
    res.setHeader("Allow", [HttpMethod.GET]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { domain, subdomain = false } = req.query;

  if (Array.isArray(domain))
    return res
      .status(400)
      .end("Bad request. domain parameter cannot be an array.");

  try {
    if (subdomain) {
      const sub = (domain as string).replace(/[^a-zA-Z0-9/-]+/g, "");

      const data = await prisma.site.findUnique({
        where: {
          subdomain: sub,
        },
      });

      const available = data === null && sub.length !== 0;

      return res.status(200).json(available);
    }

    const response = await fetch(
      `https://api.vercel.com/v6/domains/${domain}/config?teamId=${process.env.VERCEL_TEAM_ID}`,
      {
        method: HttpMethod.GET,
        headers: {
          Authorization: `Bearer ${process.env.AUTH_BEARER_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    const valid = data?.configuredBy ? true : false;

    return res.status(200).json(valid);
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}
