export async function revalidate(subdomain?: string | null, slug?: string) {
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
  } catch (err) {
    console.error(err);
  }
}
