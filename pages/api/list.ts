import { getList } from '@/lib/api/list'
import tokenValidation from '@/lib/api/tokenValidation'
import { reservedSubDomains, subDomain } from '@/lib/domainsManagement'
import { HttpMethod } from '@/types/http'
import { NextApiRequest, NextApiResponse } from 'next'
const List = async (req: NextApiRequest, res: NextApiResponse) => {
  const hostname = req.headers.host
  const currentSubDomain = subDomain(hostname!)

  if (reservedSubDomains.includes(currentSubDomain)) {
    // app specific call : in future might need to be more specific
    return res.status(401).end()
  }

  const result: any = await tokenValidation(req, res, currentSubDomain)
  // TODO : implement GET, POST, DELETE, PUT

  if (result?.verifiedToken) {
    const { verifiedToken, site } = result

    switch (req.method) {
      case HttpMethod.GET:
        //  return res.status(200).json({ verifiedToken, site })
        return getList(req, res, verifiedToken.siteId)

      default:
        res.setHeader('Allow', [
          HttpMethod.GET,
          HttpMethod.POST,
          // HttpMethod.DELETE,
          HttpMethod.PUT,
        ])
        return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  }
}

export default List
