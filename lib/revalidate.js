export async function revalidate(subdomain, slug) {
  const siteUrl = `https://${subdomain}.vercel.pub`;
  console.log(`revalidating for ${siteUrl}/${slug}`);
  try {
    await fetch(`${siteUrl}/api/revalidate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        urlPath: `/`,
      }),
    });
    await fetch(`${siteUrl}/api/revalidate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        urlPath: `/${slug}`,
      }),
    });
  } catch (e) {
    console.error(e);
  }
}
