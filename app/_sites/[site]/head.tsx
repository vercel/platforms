import { getSiteData } from "@/lib/fetchers";
import type { Meta } from "@/types";

export default async function Head({ params }: { params: { site: string } }) {
  const { site } = params;
  const data = await getSiteData(site);
  const meta = {
    title: data.name,
    description: data.description,
    logo: "/logo.png",
    ogImage: data.image,
    ogUrl: data.customDomain
      ? data.customDomain
      : `https://${data.subdomain}.vercel.pub`,
  } as Meta;

  return (
    <>
      <title>{meta?.title}</title>
      <link rel="icon" href="/favicon.ico" />
      <link rel="shortcut icon" type="image/x-icon" href={meta?.logo} />
      <link rel="apple-touch-icon" sizes="180x180" href={meta?.logo} />
      <meta name="theme-color" content="#7b46f6" />

      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      <meta itemProp="name" content={meta?.title} />
      <meta itemProp="description" content={meta?.description} />
      <meta itemProp="image" content={meta?.ogImage} />
      <meta name="description" content={meta?.description} />
      <meta property="og:title" content={meta?.title} />
      <meta property="og:description" content={meta?.description} />
      <meta property="og:url" content={meta?.ogUrl} />
      <meta property="og:image" content={meta?.ogImage} />
      <meta property="og:type" content="website" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@Vercel" />
      <meta name="twitter:creator" content="@StevenTey" />
      <meta name="twitter:title" content={meta?.title} />
      <meta name="twitter:description" content={meta?.description} />
      <meta name="twitter:image" content={meta?.ogImage} />
      {data.subdomain !== "demo" && <meta name="robots" content="noindex" />}
    </>
  );
}
