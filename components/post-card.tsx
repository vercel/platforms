import { Post, Site } from "@prisma/client";
import { BarChart, ExternalLink } from "lucide-react";
import Link from "next/link";

import BlurImage from "@/components/blur-image";
import { placeholderBlurhash, random } from "@/lib/utils";

export default function PostCard({
  data,
}: {
  data: Post & { site: Site | null };
}) {
  const url = `${data.site?.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/${data.slug}`;

  return (
    <div className="relative rounded-lg border border-stone-200 pb-10 shadow-md transition-all hover:shadow-xl dark:border-stone-700 dark:hover:border-white">
      <Link
        className="flex flex-col overflow-hidden rounded-lg"
        href={`/post/${data.id}`}
      >
        <div className="relative h-44 overflow-hidden">
          <BlurImage
            alt={data.title ?? "Card thumbnail"}
            blurDataURL={data.imageBlurhash ?? placeholderBlurhash}
            className="h-full object-cover"
            height={400}
            placeholder="blur"
            src={data.image ?? "/placeholder.png"}
            width={500}
          />
          {!data.published && (
            <span className="absolute bottom-2 right-2 rounded-md border border-stone-200 bg-white px-3 py-0.5 text-sm font-medium text-stone-600 shadow-md">
              Draft
            </span>
          )}
        </div>
        <div className="border-t border-stone-200 p-4 dark:border-stone-700">
          <h3 className="my-0 truncate font-cal text-xl font-bold tracking-wide dark:text-white">
            {data.title}
          </h3>
          <p className="mt-2 line-clamp-1 text-sm font-normal leading-snug text-stone-500 dark:text-stone-400">
            {data.description}
          </p>
        </div>
      </Link>
      <div className="absolute bottom-4 flex w-full px-4">
        <a
          className="truncate rounded-md bg-stone-100 px-2 py-1 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-400 dark:hover:bg-stone-700"
          href={
            process.env.NEXT_PUBLIC_VERCEL_ENV
              ? `https://${url}`
              : `http://${data.site?.subdomain}.localhost:3000/${data.slug}`
          }
          rel="noreferrer"
          target="_blank"
        >
          {url} ↗
        </a>
      </div>
    </div>
  );
}
