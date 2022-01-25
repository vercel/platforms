import { HttpMethod } from "@/types";

import type { NextApiRequest, NextApiResponse } from "next";

export default async function requestDelegation(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { domain } = req.query;

  try {
    const response = await fetch(
      `https://api.vercel.com/v6/domains/${domain}/request-delegation?teamId=${process.env.VERCEL_TEAM_ID}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.AUTH_BEARER_TOKEN}`,
          "Content-Type": "application/json",
        },
        method: HttpMethod.POST,
      }
    );

    res.status(response.ok ? 200 : 403).end();
  } catch (error) {
    console.error(error);
    res.status(500).end(error);
  }
}
