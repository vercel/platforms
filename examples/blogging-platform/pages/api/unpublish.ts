import prisma from '../../lib/prisma'

export default async function Unpublish(req, res) {
    const { publicationId, postId, slug } = req.query
    const data = await prisma.post.update({
        where: {
            id: postId
        },
        data: {
            published: false
        },
        include: {
            pinnedPost: true
        }
    })
    if (data.pinnedPost.length > 0) { // if it's a pinned post
        const nextPost = await prisma.post.findFirst({
            where: {
                published: true,
                publicationUrl: slug,
                NOT: {
                    id: postId
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            select: {
                id: true
            }
        })
        if (nextPost) { //if there are still posts left to pin to the top
            await prisma.pinnedPost.update({
                where: {
                    publicationId: publicationId
                },
                data: {
                    postId: nextPost.id
                }
            })
        } else { //if there are no more posts left to pin to the top
            await prisma.pinnedPost.delete({
                where: {
                    publicationId: publicationId
                }
            })
        }
    }
    res.status(200).end()
}