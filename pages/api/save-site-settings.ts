import prisma from "@/lib/prisma";

import type { NextApiRequest, NextApiResponse } from "next";

export default async function SaveSiteSettings(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const data = JSON.parse(req.body);

  const subdomain = data.subdomain.replace(/[^a-zA-Z0-9/-]+/g, "");

  const response = await prisma.site.update({
    where: {
      id: data.id,
    },
    data: {
      name: data.name,
      description: data.description,
      subdomain: subdomain.length > 0 ? subdomain : data.currentSubdomain,
      image: data.image,
      imageBlurhash: data.imageBlurhash,
    },
  });

  res.status(200).json(response);
}
