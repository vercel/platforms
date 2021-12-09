export default async function addDomain(req, res) {

    const { domain } = req.query;
    
    const response = await fetch(`https://api.vercel.com/v8/projects/${process.env.VERCEL_PROJECT_ID}/domains?teamId=${process.env.VERCEL_TEAM_ID}`, {
        body: `{\n  "name": "${domain}"\n}`,
        headers: {
            Authorization: `Bearer ${process.env.AUTH_BEARER_TOKEN}`,
            "Content-Type": "application/json"
        },
        method: "POST"
    })
    
    const data = await response.json();
    console.log(data)

    if (data.error?.code == 'forbidden') {
        res.status(403).end();
    } else if (data.error?.code == 'domain_taken') {
        res.status(409).end();
    } else {
        res.status(200).end();
    }
}
