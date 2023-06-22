import BlurImage from "@/components/BlurImage";
import { placeholderBlurhash, random } from "@/lib/utils";
import { Post, Site } from "@prisma/client";
import { BarChart, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function PostCard({
  data,
}: {
  data: Post & { site: Site | null };
}) {
  const url = `${data.site?.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/${data.slug}`;
  return (
    <div className="relative rounded-lg shadow-md hover:shadow-xl border border-stone-200 transition-all pb-10">
      <Link
        href={`/post/${data.id}`}
        className="flex flex-col rounded-lg overflow-hidden"
      >
        <BlurImage
          alt={data.title ?? "Card thumbnail"}
          width={500}
          height={400}
          className="h-44 object-cover"
          src={data.image ?? "/placeholder.png"}
          placeholder="blur"
          blurDataURL={data.imageBlurhash ?? placeholderBlurhash}
        />
        <div className="p-4">
          <h3 className="font-cal my-0 text-xl font-bold tracking-wide truncate">
            {data.title}
          </h3>
          <p className="mt-2 text-stone-500 text-sm leading-snug line-clamp-1 font-normal">
            {data.description}
          </p>
        </div>
      </Link>
      <div className="absolute bottom-4 w-full flex px-4">
        <a
          href={`https://${url}`}
          target="_blank"
          rel="noreferrer"
          className="text-sm font-medium px-2 py-1 rounded-md bg-stone-100 text-stone-600 hover:bg-stone-200 transition-colors truncate"
        >
          {url} ↗
        </a>
      </div>
    </div>
  );
}
