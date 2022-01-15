export default async function checkDomain(req, res) {
  const { domain } = req.query;

  const response = await fetch(
    `https://api.vercel.com/v6/domains/${domain}/config?teamId=${process.env.VERCEL_TEAM_ID}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.AUTH_BEARER_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );

  const data = await response.json();

  const valid = data?.configuredBy ? true : false;

  res.status(200).json(valid);
}
