import { getPlaiceholder } from "plaiceholder";

import type { NextApiRequest, NextApiResponse } from "next";

export default async function blurhash(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { url } = req.query;

  if (Array.isArray(url))
    res
      .status(400)
      .end("Bad request. URL parameter cannot be an array of urls.");

  try {
    const { blurhash } = await getPlaiceholder(url as string);

    res.status(200).json(blurhash);
  } catch (error) {
    console.error(error);
    res.status(500).end(error);
  }
}
