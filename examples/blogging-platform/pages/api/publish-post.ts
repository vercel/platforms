import prisma from '../../lib/prisma'

export default async function PublishPost(req, res) {
    const { siteId, postId } = req.query
    const postData = await prisma.post.findUnique({
        where: {
            id: postId
        }
    })
    const post = await prisma.post.update({
        where: {
            id: postId
        },
        data: {
            published: true,
            image: `https://og-image.vercel.app/${encodeURIComponent(postData.title)}.png?theme=dark&md=1&fontSize=100px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fvercel-triangle-white.svg`,
            slug: `${postData.title.replace(/[.,\/'"?'#!$%@\^&\*;:{}=\-_`~()]/g,"").replace(/\s+/g, '-').toLowerCase()}`
        }
    })
    const pinnedPost = await prisma.pinnedPost.findUnique({
        where: {
            siteId: siteId
        }
    })
    if (!pinnedPost) { // if it's the first post
        await prisma.pinnedPost.create({
            data: {
                siteId: siteId,
                postId: postId
            }
        })
    }
    res.status(200).json(post)
}