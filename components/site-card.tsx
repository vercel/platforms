import BlurImage from "@/components/blur-image";
import { placeholderBlurhash, random } from "@/lib/utils";
import { Site } from "@prisma/client";
import { BarChart, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function SiteCard({ data }: { data: Site }) {
  const url = `${data.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;
  return (
    <div className="relative rounded-lg shadow-md hover:shadow-xl border border-stone-200 transition-all pb-10">
      <Link
        href={`/site/${data.id}`}
        className="flex flex-col rounded-lg overflow-hidden"
      >
        <BlurImage
          alt={data.name ?? "Card thumbnail"}
          width={500}
          height={400}
          className="h-44 object-cover"
          src={data.image ?? "/placeholder.png"}
          placeholder="blur"
          blurDataURL={data.imageBlurhash ?? placeholderBlurhash}
        />
        <div className="p-4">
          <h3 className="font-cal my-0 text-xl font-bold tracking-wide truncate">
            {data.name}
          </h3>
          <p className="mt-2 text-stone-500 text-sm leading-snug line-clamp-1 font-normal">
            {data.description}
          </p>
        </div>
      </Link>
      <div className="absolute bottom-4 w-full flex justify-between px-4 space-x-4">
        <a
          href={
            process.env.NEXT_PUBLIC_VERCEL_ENV
              ? `https://${url}`
              : `http://${data.subdomain}.localhost:3000`
          }
          target="_blank"
          rel="noreferrer"
          className="text-sm font-medium px-2 py-1 rounded-md bg-stone-100 text-stone-600 hover:bg-stone-200 transition-colors truncate"
        >
          {url} ↗
        </a>
        <Link
          href={`/site/${data.id}/analytics`}
          className="text-sm flex items-center font-medium px-2 py-1 rounded-md bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
        >
          <BarChart height={16} />
          <p>{random(10, 40)}%</p>
        </Link>
      </div>
    </div>
  );
}
