/* eslint-disable @next/next/no-img-element */

import { sql } from "@vercel/postgres";
import { ImageResponse } from "next/server";

import { truncate } from "@/lib/utils";

export const runtime = "edge";

export default async function PostOG({
  params,
}: {
  params: { domain: string; slug: string };
}) {
  const { domain, slug } = params;

  const subdomain = domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`)
    ? domain.replace(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`, "")
    : null;

  const response = await sql`
  SELECT post.title, post.description, post.image, "user".name as "authorName", "user".image as "authorImage"
  FROM "Post" AS post 
  INNER JOIN "Site" AS site ON post."siteId" = site.id 
  INNER JOIN "User" AS "user" ON site."userId" = "user".id 
  WHERE 
    (
        site.subdomain = ${subdomain}
        OR site."customDomain" = ${domain}
    )
    AND post.slug = ${slug}
  LIMIT 1;
`;

  const data = response.rows[0];

  if (!data) {
    return new Response("Not found", { status: 404 });
  }

  const clashData = await fetch(
    new URL("@/styles/CalSans-SemiBold.otf", import.meta.url),
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div tw="flex flex-col items-center w-full h-full bg-white">
        <div tw="flex flex-col items-center justify-center mt-8">
          <h1 tw="text-6xl font-bold text-gray-900 leading-none tracking-tight">
            {data.title}
          </h1>
          <p tw="mt-4 text-xl text-gray-600 max-w-xl text-center">
            {truncate(data.description, 120)}
          </p>
          <div tw="flex items-center justify-center">
            <img
              alt={data.authorName}
              src={data.authorImage}
              tw="w-12 h-12 rounded-full mr-4"
            />
            <p tw="text-xl font-medium text-gray-900">by {data.authorName}</p>
          </div>
          <img
            alt={data.title}
            src={data.image}
            tw="mt-4 w-5/6 rounded-2xl border border-gray-200 shadow-md"
          />
        </div>
      </div>
    ),
    {
      emoji: "blobmoji",
      fonts: [
        {
          data: clashData,
          name: "Clash",
        },
      ],
      height: 600,
      width: 1200,
    },
  );
}
