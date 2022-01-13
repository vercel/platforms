import prisma from '../../lib/prisma'

export default async function SaveSiteDescription(req, res) {
    const { description, siteId } = req.query
    await prisma.site.update({
        where: {
            id: siteId
        },
        data: {
            description: description
        }
    })
    res.status(200).end()
}