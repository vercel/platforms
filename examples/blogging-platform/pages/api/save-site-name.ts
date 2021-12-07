import prisma from '../../lib/prisma'

export default async function SaveSiteName(req, res) {
    const { name, siteId } = req.query
    await prisma.site.update({
        where: {
            id: siteId
        },
        data: {
            name: name
        }
    })
    res.status(200).end()
}