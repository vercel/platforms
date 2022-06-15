import prisma from '@/lib/prisma'
import { Post } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
/**
 * Get Post
 *
 * Fetches & returns either a single or all posts available depending on
 * whether a `postId` query parameter is provided. If not all posts are
 * returned in descending order.
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 */
export async function getList(
  req: NextApiRequest,
  res: NextApiResponse,
  siteId: string
): Promise<void | NextApiResponse<Post[] | Post>> {
  // if (!session.user.id) return res.status(500).end('Server failed to get session user ID')
  const { listId, email } = req.query

  if (Array.isArray(listId) || Array.isArray(email)) {
    return res.status(400).end('Bad request. Query parameters are not valid.')
  }

  try {
    if (listId) {
      const list = await prisma.list.findUnique({
        where: {
          id: listId,
        },
        include: {
          site: true,
          listOwner: true,
        },
      })

      return res.status(200).json(list)
    }

    if (email) {
      const listOwner = await prisma.listOwner.findUnique({
        where: {
          email,
        },
      })

      const lists = !listOwner
        ? []
        : await prisma.list.findMany({
            where: {
              listOwnerId: listOwner.id,
            },
            include: {
              site: true,
              listOwner: true,
            },
          })

      return res.status(200).json({
        lists,
      })
    }

    const site = await prisma.site.findFirst({
      where: {
        id: siteId,
      },
    })

    const lists = !site
      ? []
      : await prisma.list.findMany({
          where: {
            siteId,
          },
          orderBy: {
            createdAt: 'desc',
          },
        })

    return res.status(200).json({
      lists,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).end(error)
  }
}
