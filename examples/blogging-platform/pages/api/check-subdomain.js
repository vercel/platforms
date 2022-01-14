import prisma from "@/lib/prisma";

export default async function checkSubdomain(req, res) {
  const { subdomain } = req.query;

  const data = await prisma.site.findUnique({
    where: {
      subdomain,
    },
  });

  const available = data === null;

  res.status(200).json(available);
}
