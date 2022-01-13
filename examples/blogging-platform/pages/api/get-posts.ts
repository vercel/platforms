import prisma from '../../lib/prisma'

export default async function getPosts(req, res) {
    const { siteId } = req.query
    const posts = await prisma.post.findMany({
        where: {
            Site: {
                id: siteId
            },
            published: true
        },
        include: {
            pinnedPost: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    })
    const site = await prisma.site.findUnique({
        where: {
            id: siteId
        }
    }) 
    res.status(200).json({posts, site})
}