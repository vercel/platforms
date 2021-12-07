import prisma from '../../lib/prisma'

export default async function SavePollSlug(req, res) {
    const { postId, slug } = req.query
    await prisma.post.update({
        where: {
            id: postId
        },
        data: {
            slug: slug
        }
    })
    res.status(200).end()
}