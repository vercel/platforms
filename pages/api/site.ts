import { authOptions } from "./auth/[...nextauth]";
import { createSite, deleteSite, getSite, updateSite } from "@/lib/api";
import { getServerSession } from "next-auth/next";

import type { NextApiRequest, NextApiResponse } from "next";

export default async function site(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession({ req, res }, authOptions);
  if (!session) return res.status(401).end();

  switch (req.method) {
    case "GET":
      return getSite(req, res, session);
    case "POST":
      return createSite(req, res);
    case "DELETE":
      return deleteSite(req, res);
    case "PUT":
      return updateSite(req, res);
    default:
      res.setHeader("Allow", ["GET", "POST", "DELETE", "PUT"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
