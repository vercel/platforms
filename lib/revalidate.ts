import { HttpMethod } from "@/types";

export async function revalidate(domain?: string | null, slug?: string) {
  const urlPaths = [`/${slug}`, `/`];

  // refer to https://solutions-on-demand-isr.vercel.app/ for more info
  try {
    await Promise.all(
      urlPaths.map((urlPath) =>
        fetch(`${domain}/api/revalidate`, {
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
