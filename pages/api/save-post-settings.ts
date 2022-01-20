import prisma from "@/lib/prisma";

import type { NextApiRequest, NextApiResponse } from "next";

export default async function SavePostSettings(
  req: NextApiRequest,
  res: NextApiResponse
) {
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
