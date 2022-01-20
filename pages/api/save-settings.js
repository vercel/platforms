import prisma from "@/lib/prisma";

export default async function SaveSiteSettings(req, res) {
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
