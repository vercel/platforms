export const runtime = "edge"; // 'nodejs' is the default
import { Metadata } from "next";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import parser from "ua-parser-js";

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

export function GET(request: Request) {
  const userAgent = parser(request.headers.get("user-agent") || "");
  return new Response(JSON.stringify(userAgent), {
    status: 200,
  });
}
