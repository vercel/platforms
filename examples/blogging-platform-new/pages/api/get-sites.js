import prisma from "../../lib/prisma";

export default async function getSites(req, res) {
  const { sessionId } = req.query;
  const sites = await prisma.site.findMany({
    where: {
      user: {
        id: sessionId,
      },
    },
  });
  res.status(200).json(sites);
}
