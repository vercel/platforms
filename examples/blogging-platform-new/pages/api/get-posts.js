import prisma from "../../lib/prisma";

export default async function getPosts(req, res) {
  const { siteId, published } = req.query;
  const posts = await prisma.post.findMany({
    where: {
      site: {
        id: siteId,
      },
      published: JSON.parse(published),
    },
    include: {
      site: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  res.status(200).json(posts);
}
