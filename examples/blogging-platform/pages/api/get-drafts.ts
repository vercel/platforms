import prisma from '../../lib/prisma'

export default async function getDrafts(req, res) {
    const { siteId } = req.query

    const drafts = await prisma.post.findMany({
        where: {
            Site: {
                id: siteId
            },
            published: false
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
    res.status(200).json({drafts, site})
}