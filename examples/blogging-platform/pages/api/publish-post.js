import prisma from "@/lib/prisma";

export default async function PublishPost(req, res) {
  const { postId } = req.query;
  const post = await prisma.post.update({
    where: {
      id: postId,
    },
    data: {
      published: true,
    },
  });
  res.status(200).json(post);
}
