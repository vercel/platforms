import prisma from '../../lib/prisma'

export default async function DeleteSite(req, res) {
    const { siteId } = req.query
    await prisma.siteUser.deleteMany({
        where: {
            siteId: siteId
        }
    })
    try {
        await prisma.pinnedPost.delete({
            where: {
                siteId: siteId
            }
        })
    } catch {
        console.log('no pinned post to delete!')
    }
    try {
        await prisma.post.deleteMany({
            where: {
                Site: {
                    id: siteId
                }
            }
        })
    } catch {
        console.log('no posts to delete!')
    }
    await prisma.site.delete({
        where: {
            id: siteId
        }
    })
    res.status(200).end()
}