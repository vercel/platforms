import { HttpMethod } from "@/types";

export async function revalidate(subdomain?: string | null, slug?: string) {
  const siteUrl = `https://${subdomain}.vercel.pub`;

  const urlPaths = [`/${slug}`, `/`];

  try {
    await Promise.all(
      urlPaths.map((urlPath) =>
        fetch(`${siteUrl}/api/revalidate`, {
          method: HttpMethod.POST,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            urlPath,
          }),
        })
      )
    );
  } catch (err) {
    console.error(err);
  }
}
