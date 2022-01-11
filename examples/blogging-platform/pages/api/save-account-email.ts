import prisma from '../../lib/prisma'

export default async function SaveAccountEmail(req, res) {
    const { accountId, email } = req.query
    await prisma.user.update({
        where: {
            id: accountId
        },
        data: {
            email: email
        }
    })
    res.status(200).end()
}