import prisma from '@/lib/prisma'
import { HttpMethod } from '@/types'
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from './auth/[...nextauth]'

const generateToken = async (siteId: string) => {
  const site = await prisma.site.findFirst({ where: { id: siteId } })
  return site
}

const Token = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession({ req, res }, authOptions)
  const { siteId } = req.query

  if (!session || !siteId) return res.status(401).end()

  switch (req.method) {
    case HttpMethod.GET:
      return res.status(200).json(session)
    default:
      res.setHeader('Allow', [HttpMethod.GET])
      return res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

export default Token
