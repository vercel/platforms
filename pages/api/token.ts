import prisma from '@/lib/prisma'
import { HttpMethod } from '@/types'
import jwt from 'jsonwebtoken'
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from './auth/[...nextauth]'

const Token = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession({ req, res }, authOptions)
  const { siteId } = req.query

  if (!session || !siteId) return res.status(401).end()

  const site = await prisma.site.findFirst({
    where: { id: siteId as string },
    select: { subdomain: true },
  })

  if (!site) return res.status(401).end()

  switch (req.method) {
    case HttpMethod.GET:
      const token = jwt.sign(
        {
          subdomain: site.subdomain as string,
          siteId: siteId as string,
        },
        process.env.SECRET!
      )
      return res.status(200).json({ token })
    default:
      res.setHeader('Allow', [HttpMethod.GET])
      return res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

export default Token
