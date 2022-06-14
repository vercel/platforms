import { reservedSubDomains, subDomain } from '@/lib/domainsManagement'
import prisma from '@/lib/prisma'
import { verify } from 'jsonwebtoken'
import { NextApiRequest, NextApiResponse } from 'next'
const List = async (req: NextApiRequest, res: NextApiResponse) => {
  const hostname = req.headers.host
  const currentSubDomain = subDomain(hostname!)

  if (reservedSubDomains.includes(currentSubDomain)) {
    // app specific call : in future might need to be more specific
    return res.status(401).end()
  }

  const token = req.headers.authorization?.replace('Bearer ', '') || ''
  // Note: api call coming from client SDK. lets validate using JWT
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

  // TODO : implement GET, POST, DELETE, PUT

  return res.status(200).json({
    currentSubDomain,
    verifiedToken,
    site,
  })
}

export default List
