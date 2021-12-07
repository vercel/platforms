import prisma from '../../lib/prisma'

export default async function SaveAccountName(req, res) {
    const { accountId, name } = req.query
    await prisma.user.update({
        where: {
            id: accountId
        },
        data: {
            name: name
        }
    })
    res.status(200).end()
}