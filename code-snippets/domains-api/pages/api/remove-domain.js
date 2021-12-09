export default async function removeDomain(req, res) {

    const { domain } = req.query;
    
    const response = await fetch(`https://api.vercel.com/v8/projects/${process.env.VERCEL_PROJECT_ID}/domains/${domain}?teamId=${process.env.VERCEL_TEAM_ID}`, {
        headers: {
            Authorization: `Bearer ${process.env.AUTH_BEARER_TOKEN}`,
        },
        method: "DELETE"
    })
    
    const data = await response.json();

    console.log(data)
    
    res.status(200).end();
}
