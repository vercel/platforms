import { getPlaiceholder } from "plaiceholder";

export default async function blurhash(req, res) {
  const { url } = req.query;
  const { blurhash } = await getPlaiceholder(url);

  res.status(200).json(blurhash);
}
