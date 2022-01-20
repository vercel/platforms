import prisma from "@/lib/prisma";

import type { NextApiRequest, NextApiResponse } from "next";

export default async function getPostData(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { postId } = req.query;

  if (Array.isArray(postId))
    res.status(400).end("Bad request. postId parameter cannot be an array.");

  const post = await prisma.post.findUnique({
    where: {
      id: postId as string,
    },
    include: {
      site: true,
    },
  });
  res.status(200).json(post);
}
