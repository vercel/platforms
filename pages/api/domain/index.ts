import { createDomain, deleteDomain } from "@/lib/api";
import { getServerSession } from "next-auth/next";

import { authOptions } from "../auth/[...nextauth]";
import { HttpMethod } from "@/types";

import type { NextApiRequest, NextApiResponse } from "next";

export default async function domain(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession({ req, res }, authOptions);
  if (!session) return res.status(401).end();

  switch (req.method) {
    case HttpMethod.POST:
      return createDomain(req, res);
    case HttpMethod.DELETE:
      return deleteDomain(req, res);
    default:
      res.setHeader("Allow", [HttpMethod.POST, HttpMethod.DELETE]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
