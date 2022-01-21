import prisma from "@/lib/prisma";

import type { NextApiRequest, NextApiResponse } from "next";

export default async function SavePostSettings(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const data = JSON.parse(req.body);

  const response = await prisma.post.update({
    where: {
      id: data.id,
    },
    data: {
      slug: data.slug,
      image: data.image,
      imageBlurhash: data.imageBlurhash,
    },
  });

  res.status(200).json(response);
}
