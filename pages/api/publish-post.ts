import prisma from "@/lib/prisma";

import type { NextApiRequest, NextApiResponse } from "next";

export default async function PublishPost(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { postId } = req.query;

  if (Array.isArray(postId))
    res.status(400).end("Bad request. postId parameter cannot be an array.");

  const post = await prisma.post.update({
    where: {
      id: postId as string,
    },
    data: {
      published: true,
    },
  });

  res.status(200).json(post);
}
