import { HttpMethod } from "@/types";

import type { NextApiRequest, NextApiResponse } from "next";

export default async function checkDomain(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== HttpMethod.GET) {
    res.setHeader("Allow", [HttpMethod.GET]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { domain } = req.query;

  try {
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

    res.status(200).json(valid);
  } catch (error) {
    console.error(error);
    res.status(500).end(error);
  }
}
