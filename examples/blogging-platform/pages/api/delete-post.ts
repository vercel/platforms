import prisma from '../../lib/prisma'

export default async function DeletePost(req, res) {
    const { siteId, postId, slug, draft } = req.query
    if (draft === "true") {
        await prisma.post.delete({
            where: {
                id: postId
            }
        })
        res.status(200).end()
    }
    const data = await prisma.pinnedPost.findUnique({
        where: {
            siteId: siteId
        }
    })
    if (data.postId == postId) { // if it's a pinned post
        const nextPost = await prisma.post.findFirst({
            where: {
                published: true,
                siteUrl: slug,
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
                    siteId: siteId
                },
                data: {
                    postId: nextPost.id
                }
            })
        } else { //if there are no more posts left to pin to the top
            await prisma.pinnedPost.delete({
                where: {
                    siteId: siteId
                }
            })
        }
        await prisma.post.delete({
            where: {
                id: postId
            }
        })
    } else {
        await prisma.post.delete({
            where: {
                id: postId
            }
        })
    }
    res.status(200).end()
}