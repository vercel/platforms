import prisma from "@/lib/prisma";

import type { NextApiRequest, NextApiResponse } from "next";

export default async function DeletePost(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "DELETE") {
    res.setHeader("Allow", ["DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { postId } = req.query;

  if (Array.isArray(postId))
    res.status(400).end("Bad request. postId parameter cannot be an array.");

  try {
    await prisma.post.delete({
      where: {
        id: postId as string,
      },
    });

    res.status(200).end();
  } catch (error) {
    console.error(error);
    res.status(500).end(error);
  }
}
