import prisma from '@/lib/prisma'
import { Post } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

/**
 * Get List
 *
 * Fetches & returns either a single or all lists available depending on
 * whether a `listId` query parameter is provided. If email provided then all lists
 * related to email and site will be returned
 * If nonthing provided then all lists are
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
      const list = await prisma.list.findFirst({
        where: {
          id: listId,
          siteId,
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
              siteId,
            },
            include: {
              site: true,
              listOwner: true,
            },
            orderBy: {
              createdAt: 'desc',
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

/**
 * Update list
 *
 * you can not update list owner once it is created
 *
 * @param req
 * @param res
 * @param siteId
 * @returns
 */
export const updateList = async (req: NextApiRequest, res: NextApiResponse, siteId: string) => {
  const { id, title, description, handle, image, imageBlurhash } = req.body

  if (!id) {
    res.status(400).end('Bad request. id is required.')
  }

  // making sure request list belong to correct site
  // due to multi tenancy
  const list = await prisma.list.findFirst({
    where: {
      id,
      siteId,
    },
  })

  if (!list) {
    return res.status(401).end()
  }

  try {
    const list = await prisma.list.update({
      where: {
        id: id,
      },
      data: {
        title,
        description,
        handle,
        image,
        imageBlurhash,
      },
    })

    return res.status(200).json(list)
  } catch (error) {
    console.error(error)
    return res.status(500).end(error)
  }
}

export const createList = async (req: NextApiRequest, res: NextApiResponse, siteId: string) => {
  const { title, description, handle, image, imageBlurhash, email } = req.body

  if (!email) {
    res.status(400).end('Bad request. Email is required.')
  }

  try {
    const listOwner = await prisma.listOwner.upsert({
      where: {
        email,
      },
      update: {},
      create: {
        email,
      },
    })

    const list = await prisma.list.create({
      data: {
        title,
        description,
        handle,
        image,
        imageBlurhash,
        site: {
          connect: {
            id: siteId,
          },
        },
        listOwner: {
          connect: {
            id: listOwner.id,
          },
        },
      },
    })

    return res.status(200).json(list)
  } catch (error) {
    console.error(error)
    return res.status(500).end(error)
  }
}
