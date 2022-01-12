import prisma from "../../lib/prisma";

export default async function getSiteSettings(req, res) {
  const { siteId } = req.query;
  const settings = await prisma.site.findUnique({
    where: {
      id: siteId,
    },
  });
  res.status(200).json(settings);
}
