import BlurImage from "@/components/blur-image";
import { placeholderBlurhash, random } from "@/lib/utils";
import { Post, Organization } from "@prisma/client";
import { BarChart, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function PostCard({
  data,
}: {
  data: Post & { organization: Organization | null };
}) {
  const url = `${data.organization?.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/${data.slug}`;

  return (
    <div className="relative rounded-lg border border-brand-gray200 pb-10 shadow-md transition-all hover:shadow-xl dark:border-brand-gray700 dark:hover:border-white">
      <Link
        href={`/post/${data.id}`}
        className="flex flex-col overflow-hidden rounded-lg"
      >
        <div className="relative h-44 overflow-hidden">
          <BlurImage
            alt={data.title ?? "Card thumbnail"}
            width={500}
            height={400}
            className="h-full object-cover"
            src={data.image ?? "/placeholder.png"}
            placeholder="blur"
            blurDataURL={data.imageBlurhash ?? placeholderBlurhash}
          />
          {!data.published && (
            <span className="absolute bottom-2 right-2 rounded-md border border-brand-gray200 bg-white px-3 py-0.5 text-sm font-medium text-brand-gray600 shadow-md">
              Draft
            </span>
          )}
        </div>
        <div className="border-t border-brand-gray200 p-4 dark:border-brand-gray700">
          <h3 className="my-0 truncate font-cal text-xl font-bold tracking-wide dark:text-white dark:text-white">
            {data.title}
          </h3>
          <p className="mt-2 line-clamp-1 text-sm font-normal leading-snug text-brand-gray500 dark:text-brand-gray400">
            {data.description}
          </p>
        </div>
      </Link>
      <div className="absolute bottom-4 flex w-full px-4">
        <a
          href={
            process.env.NEXT_PUBLIC_VERCEL_ENV
              ? `https://${url}`
              : `http://${data.organization?.subdomain}.localhost:3000/${data.slug}`
          }
          target="_blank"
          rel="noreferrer"
          className="truncate rounded-md bg-brand-gray100 px-2 py-1 text-sm font-medium text-brand-gray600 transition-colors hover:bg-brand-gray200 dark:bg-brand-gray800 dark:text-brand-gray400 dark:hover:bg-brand-gray700"
        >
          {url} ↗
        </a>
      </div>
    </div>
  );
}
