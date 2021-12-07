import prisma from '../../lib/prisma'

export default async function getSites(req, res) {
    const { sessionId } = req.query
    const sites = await prisma.site.findMany({
        where: {
            users: {
                some: {
                    userId: sessionId
                }
            }
        }
    })
    res.status(200).json({sites})
}
