export default async function requestDelegation(req, res) {
  const { domain } = req.query;

  const response = await fetch(
    `https://api.vercel.com/v6/domains/${domain}/request-delegation?teamId=${process.env.VERCEL_TEAM_ID}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.AUTH_BEARER_TOKEN}`,
        "Content-Type": "application/json",
      },
      method: "POST",
    }
  );

  if (response.ok) {
    res.status(200).end();
  } else {
    res.status(403).end();
  }
}
