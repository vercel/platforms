import prisma from "@/lib/prisma";

export default async function checkSubdomain(req, res) {
  const { subdomain } = req.query;
  const sub = subdomain.replace(/[^a-zA-Z0-9/-]+/g, "");

  const data = await prisma.site.findUnique({
    where: {
      subdomain: sub,
    },
  });

  const available = data === null && sub.length !== 0;

  res.status(200).json(available);
}
