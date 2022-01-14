import prisma from "@/lib/prisma";

export default async function getPostData(req, res) {
  const { postId } = req.query;
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
    include: {
      site: true,
    },
  });
  res.status(200).json(post);
}
