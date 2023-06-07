/* eslint-disable @next/next/no-img-element */

import { truncate } from "@/lib/utils";
import { ImageResponse } from "next/server";

export const runtime = "edge";

export default async function PostOG({
  params,
}: {
  params: { domain: string; slug: string };
}) {
  const { domain, slug } = params;

  const data = {
    title: "Platforms Starter Kit",
    description:
      "Learn more about this template for site builders, multi-tenant platforms, and low-code tools.",
    image:
      "https://res.cloudinary.com/vercel-platforms/image/upload/v1663197120/yrbx7hvoyx9mytwqvkwh.png",
    author: {
      name: "Steven Tey",
      image: "https://avatars.githubusercontent.com/u/28986134?v=4",
    },
  };

  const clashData = await fetch(
    new URL("@/styles/CalSans-Semibold.otf", import.meta.url)
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
              tw="w-12 h-12 rounded-full mr-4"
              src={data.author.image}
              alt={data.author.name}
            />
            <p tw="text-xl font-medium text-gray-900">by {data.author.name}</p>
          </div>
          <img tw="mt-4 w-5/6 rounded-2xl" src={data.image} alt={data.title} />
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 600,
      fonts: [
        {
          name: "Clash",
          data: clashData,
        },
      ],
      emoji: "blobmoji",
    }
  );
}
