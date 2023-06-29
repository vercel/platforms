import Link from "next/link";
import BlurImage from "./blur-image";

import type { Post } from "@prisma/client";
import { placeholderBlurhash, toDateString } from "@/lib/utils";

interface BlogCardProps {
  data: Pick<
    Post,
    "slug" | "image" | "imageBlurhash" | "title" | "description" | "createdAt"
  >;
}

export default function BlogCard({ data }: BlogCardProps) {
  return (
    <Link href={`/${data.slug}`}>
      <div className="ease overflow-hidden rounded-2xl border-2 border-gray-100 bg-white shadow-md transition-all duration-200 hover:-translate-y-1 hover:shadow-xl">
        {data.image ? (
          <BlurImage
            src={data.image}
            alt={data.title ?? "Blog Post"}
            width={500}
            height={400}
            className="h-64 w-full object-cover"
            placeholder="blur"
            blurDataURL={data.imageBlurhash ?? placeholderBlurhash}
          />
        ) : (
          <div className="absolute flex h-full w-full select-none items-center justify-center bg-gray-100 text-4xl text-gray-500">
            ?
          </div>
        )}
        <div className="h-36 border-t border-gray-200 px-5 py-8">
          <h3 className="font-title text-xl tracking-wide">{data.title}</h3>
          <p className="text-md my-2 truncate italic text-gray-600">
            {data.description}
          </p>
          <p className="my-2 text-sm text-gray-600">
            Published {toDateString(data.createdAt)}
          </p>
        </div>
      </div>
    </Link>
  );
}
