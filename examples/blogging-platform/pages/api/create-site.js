import prisma from '../../lib/prisma'

export default async function CreateSite(req, res) {
    const { name, url, description, userId } = req.query
    const response = await prisma.site.create({
        data: {
            name: name,
            description: description.length > 0 ? description : "The hottest gossip about armadilos",
            url: url, 
        }
    })
    await prisma.siteUser.create({
        data: {
            siteId: response.id,
            userId: userId,
            role: "Owner",
        }
    })
    res.status(200).json({siteId: response.id})
}