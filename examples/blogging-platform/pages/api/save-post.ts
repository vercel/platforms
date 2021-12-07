import prisma from '../../lib/prisma'

export default async function SavePost(req, res) {
    const data = JSON.parse(req.body)
    const response = await prisma.post.update({
        where: {
            id: data.id
        },
        data: {
            title: data.title,
            description: data.description,
            content: data.content,
        }
    })
    
    res.status(200).json(response)
}