import prisma from "@/lib/prisma";

export default async function DeletePost(req, res) {
  const { postId } = req.query;
  await prisma.post.delete({
    where: {
      id: postId,
    },
  });
  res.status(200).end();
}
