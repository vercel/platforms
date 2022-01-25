import Link from "next/link";
import BlurImage from "./BlurImage";
import Date from "./Date";

import type { Post } from "@prisma/client";

interface BlogCardProps {
  data: Pick<
    Post,
    "slug" | "image" | "imageBlurhash" | "title" | "description" | "createdAt"
  >;
}

export default function BlogCard({ data }: BlogCardProps) {
  return (
    <Link href={`/${data.slug}`}>
      <a>
        <div className="rounded-2xl border-2 border-gray-100 overflow-hidden shadow-md bg-white hover:shadow-xl hover:-translate-y-1 transition-all ease duration-200">
          {data.image ? (
            <BlurImage
              src={data.image}
              alt={data.title ?? "Blog "}
              width={500}
              height={400}
              layout="responsive"
              objectFit="cover"
              placeholder="blur"
              blurDataURL={data.imageBlurhash ?? undefined}
            />
          ) : (
            <div className="absolute flex items-center justify-center w-full h-full bg-gray-100 text-gray-500 text-4xl select-none">
              ?
            </div>
          )}
          <div className="py-8 px-5 h-36 border-t border-gray-200">
            <h3 className="font-cal text-xl tracking-wide">{data.title}</h3>
            <p className="text-md italic text-gray-600 my-2 truncate">
              {data.description}
            </p>
            <p className="text-sm text-gray-600 my-2">
              Published <Date dateString={data.createdAt.toString()} />
            </p>
          </div>
        </div>
      </a>
    </Link>
  );
}
