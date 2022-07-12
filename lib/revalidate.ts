import { HttpMethod } from "@/types";

export async function revalidate(
  hostname: string, // hostname to be revalidated
  siteId: string, // siteId
  slug: string // slugname for the post
) {
  const urlPaths = [`/_sites/${siteId}/${slug}`, `/_sites/${siteId}`];

  // refer to https://solutions-on-demand-isr.vercel.app/ for more info on bulk/batch revalidate
  try {
    await Promise.all(
      urlPaths.map((urlPath) =>
        fetch(`${hostname}/api/revalidate`, {
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
