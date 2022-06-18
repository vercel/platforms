import prisma from '@/lib/prisma'
import { verify } from 'jsonwebtoken'
import { NextApiRequest, NextApiResponse } from 'next'
const tokenValidation = async (req: NextApiRequest, res: NextApiResponse, currentSubDomain: string) => {
  const token = req.headers.authorization?.replace('Bearer ', '') || ''
  // Note: api call coming from client SDK. lets validate using JWT
  try {
    const verifiedToken = verify(token, process.env.SECRET!)

    if (
      !verifiedToken ||
      typeof verifiedToken === 'string' ||
      !verifiedToken?.subdomain ||
      verifiedToken.subdomain !== currentSubDomain ||
      !verifiedToken?.siteId
    ) {
      return res.status(401).end()
    }

    const site = await prisma.site.findUnique({
      where: {
        id: verifiedToken.siteId,
      },
      select: {
        subdomain: true,
      },
    })

    if (!site || site?.subdomain !== verifiedToken.subdomain) {
      return res.status(401).end()
    }

    return { verifiedToken, site }
  } catch {
    res.status(401).end()
  }
}

export default tokenValidation
