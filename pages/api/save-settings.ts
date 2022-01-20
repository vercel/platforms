import prisma from "@/lib/prisma";

import type { NextApiRequest, NextApiResponse } from "next";

export default async function SaveSiteSettings(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const data = JSON.parse(req.body);

  const response = await prisma.user.update({
    where: {
      id: data.id,
    },
    data: {
      name: data.name,
      email: data.email,
      image: data.image,
    },
  });

  res.status(200).json(response);
}
