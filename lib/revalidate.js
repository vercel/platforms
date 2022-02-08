export async function revalidate(subdomain, slug) {
  console.log(subdomain, slug);
  const siteUrl = `https://${subdomain}.vercel.pub`;
  try {
    await fetch(`${siteUrl}/api/revalidate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        urlPath: `/${slug}`,
      }),
    });
    await fetch(`${siteUrl}/api/revalidate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        urlPath: `/`,
      }),
    });
  } catch (e) {
    console.error(e);
  }
}
