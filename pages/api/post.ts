import { createPost, deletePost, getPost, updatePost } from "@/lib/api";
import { getServerSession } from "next-auth/next";

import { authOptions } from "./auth/[...nextauth]";

import type { NextApiRequest, NextApiResponse } from "next";

export default async function post(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession({ req, res }, authOptions);
  if (!session) return res.status(401).end();

  switch (req.method) {
    case "GET":
      return getPost(req, res);
    case "POST":
      return createPost(req, res);
    case "DELETE":
      return deletePost(req, res);
    case "PUT":
      return updatePost(req, res);
    default:
      res.setHeader("Allow", ["GET", "POST", "DELETE", "PUT"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
