import prisma from '../../lib/prisma'

export default async function getSiteData(req, res) {
    const { siteId } = req.query
    const data = await prisma.site.findUnique({
        where: {
            id: siteId
        }
    })
    res.status(200).json(data)
}