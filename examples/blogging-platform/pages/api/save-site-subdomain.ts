import prisma from '../../lib/prisma'

export default async function SaveSiteSubdomain(req, res) {
    const { subdomain, siteId } = req.query
    await prisma.site.update({
        where: {
            id: siteId
        },
        data: {
            url: subdomain
        }
    })
    res.status(200).end()
}