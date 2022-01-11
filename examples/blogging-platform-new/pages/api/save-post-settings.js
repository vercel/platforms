import prisma from "@/lib/prisma";

export default async function SavePostSettings(req, res) {
  const data = JSON.parse(req.body);
  console.log(data);
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
