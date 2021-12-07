import prisma from '../../lib/prisma'

export default async function SaveCustomDomain(req, res) {
    const { domain, oldDomain, siteId } = req.query
    if (domain != oldDomain ) { // only trigger this function if there are differences between the existing and new custom domains
        if (domain.length > 0) { // if the new domain is not an empty string (might want to use a better validation technique here)
            // add domain to project using Vercel API
            const resAdd = await fetch(`https://api.vercel.com/v8/projects/${process.env.VERCEL_PROJECT_ID}/domains?teamId=${process.env.VERCEL_TEAM_ID}`, {
                body: `{\n  "name": "${domain}"\n}`,
                headers: {
                    Authorization: `Bearer ${process.env.AUTH_BEARER_TOKEN}`,
                    "Content-Type": "application/json"
                },
                method: "POST"
            })
            console.log(resAdd)
            if (resAdd.ok) { // if the domain was successfully added
                // update custom domain in database
                await prisma.site.update({
                    where: {
                        id: siteId
                    },
                    data: {
                        customDomain: domain
                    }
                })
                // if there was an old custom domain, we need to remove it after adding the new one
                if (oldDomain.length > 0) {
                    await fetch(`https://api.vercel.com/v8/projects/${process.env.VERCEL_PROJECT_ID}/domains/${oldDomain}?teamId=${process.env.VERCEL_TEAM_ID}`, {
                        headers: {
                            Authorization: `Bearer ${process.env.AUTH_BEARER_TOKEN}`,
                        },
                        method: "DELETE"
                    })
                }
            } else {
                // potential edge case: domain is in use by another Vercel project
                // in this case we have to request delegation from that project using the Vercel API
                const resRequestShareDomains = await fetch(`https://api.vercel.com/v6/domains/${domain}/request-delegation?teamId=${process.env.VERCEL_TEAM_ID}`, {
                    headers: {
                        Authorization: `Bearer ${process.env.AUTH_BEARER_TOKEN}`,
                        "Content-Type": "application/json"
                    },
                    method: "POST"
                })
                console.log(resRequestShareDomains)
                // if the domain delegation request worked, that means you can now share the domains between the two projects
                if (resRequestShareDomains.ok) {
                    res.status(408).end() 
                // if not, then the domain cannot be added to the project
                } else {
                    res.status(409).end()
                }
            }
        } else { // if there is no new domain (meaning that the user just wanted to remove their old domain)
            // delete domain from project using Vercel API
            await fetch(`https://api.vercel.com/v8/projects/${process.env.VERCEL_PROJECT_ID}/domains/${oldDomain}?teamId=${process.env.VERCEL_TEAM_ID}`, {
                headers: {
                    Authorization: `Bearer ${process.env.AUTH_BEARER_TOKEN}`,
                },
                method: "DELETE"
            })
            // delete domain from database
            await prisma.site.update({
                where: {
                    id: siteId
                },
                data: {
                    customDomain: null
                }
            })
        }
    }
    res.status(200).end()
}