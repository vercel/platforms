import prisma from '../../lib/prisma'

export default async function CreatePost(req, res) {
    const { siteUrl } = req.query
    const response = await prisma.post.create({
        data: {
            siteUrl: siteUrl
        }
    })
    res.status(200).json({postId: response.id})
}