export const runtime = "edge";
import { sql } from "@vercel/postgres";
import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { NextResponse } from "next/server";
import { UAParser } from "ua-parser-js";

import { DynamicLinkInfo, getFallbackUrl } from "@/lib/links";

// export async function generateMetadata({
//   params,
// }: {
//   params: { domain: string };
// }): Promise<Metadata | null> {
//   const data = await getSiteData(params.domain);
//   if (!data) {
//     return null;
//   }
//   const {
//     description,
//     image,
//     logo,
//     name: title,
//   } = data as {
//     description: string;
//     image: string;
//     logo: string;
//     name: string;
//   };

//   return {
//     description,
//     icons: [logo],
//     metadataBase: new URL(`https://${params.domain}`),
//     openGraph: {
//       description,
//       images: [image],
//       title,
//     },
//     title,
//     twitter: {
//       card: "summary_large_image",
//       creator: "@vercel",
//       description,
//       images: [image],
//       title,
//     },
//   };
// }

// If it contains a header just return the link object from the info.
// This is because its being requsted via the SDK presumably from within an app.
// if not, its being requested from a browser and the use doesn't have the app
// so we have to take them to the fallback URL so we need to redirect to the fallback url
// Finally, its possible that we can't find the link at all at which point we return 404
export async function GET(request: Request) {
  const domain = request.headers.get("host");

  // going for @vercel/postgres
  // as unlike Prisma it supports edge runtime and sql-over-http
  // https://vercel.com/changelog/improved-performance-for-vercel-postgres-from-edge-functions

  const client = await sql.connect();
  const { fields, rows } =
    await client.sql`SELECT * FROM DynamicLink WHERE url = ${domain};`;

  if (rows.length === 0) {
    client.release();
    return notFound();
  }

  const dynamicLinkInfo = rows[0].info as DynamicLinkInfo;

  if (request.headers.get("x-segtrace-link-request")) {
    client.release();
    return new Response(JSON.stringify({ link: dynamicLinkInfo.link }));
  }

  const userAgent = new UAParser(request.headers.get("user-agent") || "");

  const fallbackUrl = getFallbackUrl(dynamicLinkInfo, userAgent);

  // TODO; add analytics info for redirect
  client.release();
  return NextResponse.redirect(fallbackUrl, { status: 301 });
}
