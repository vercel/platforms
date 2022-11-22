import Link from "next/link";
import BlurImage from "@/components/BlurImage";
import BlogCard from "@/components/BlogCard";
import prisma from "@/lib/prisma";

import type { _SiteData } from "@/types";
import { placeholderBlurhash } from "@/lib/util";
import { getSiteData } from "@/lib/fetchers";

export async function generateStaticParams() {
  const [subdomains, customDomains] = await Promise.all([
    prisma.site.findMany({
      // you can remove this if you want to generate all sites at build time
      where: {
        subdomain: "demo",
      },
      select: {
        subdomain: true,
      },
    }),
    prisma.site.findMany({
      where: {
        NOT: {
          customDomain: null,
        },
        // you can remove this if you want to generate all sites at build time
        customDomain: "platformize.co",
      },
      select: {
        customDomain: true,
      },
    }),
  ]);

  const allPaths = [
    ...subdomains.map(({ subdomain }) => subdomain),
    ...customDomains.map(({ customDomain }) => customDomain),
  ].filter((path) => path) as Array<string>;

  return allPaths.map((path) => ({
    site: path,
  }));
}
export default async function Page({ params }: { params: { site: string } }) {
  const { site } = params;
  const data = await getSiteData(site);

  return (
    <div className="md:mb-28">
      {data.posts.length > 0 ? (
        <div>
          <Link href={`/${data.posts[0].slug}`}>
            <div className="max-w-screen-xl relative group h-80 sm:h-150 w-full mx-auto overflow-hidden lg:rounded-xl">
              {data.posts[0].image ? (
                <BlurImage
                  alt={data.posts[0].title ?? ""}
                  blurDataURL={
                    data.posts[0].imageBlurhash ?? placeholderBlurhash
                  }
                  className="group-hover:scale-105 group-hover:duration-300 h-full w-full object-cover"
                  width={1300}
                  height={630}
                  placeholder="blur"
                  src={data.posts[0].image}
                />
              ) : (
                <div className="absolute flex items-center justify-center w-full h-full bg-gray-100 text-gray-500 text-4xl select-none">
                  ?
                </div>
              )}
            </div>
            <div className="max-w-screen-xl mx-5 xl:mx-auto mt-10">
              <h2 className="font-title text-4xl md:text-6xl my-10">
                {data.posts[0].title}
              </h2>
              <p className="text-base md:text-lg w-full lg:w-2/3">
                {data.posts[0].description}
              </p>
              <div className="flex justify-start items-center space-x-4 w-full">
                <div className="relative w-8 h-8 flex-none rounded-full overflow-hidden">
                  {data.user?.image ? (
                    <BlurImage
                      alt={data.user?.name ?? "User Avatar"}
                      width={100}
                      height={100}
                      className="w-full h-full object-cover"
                      src={data.user?.image}
                    />
                  ) : (
                    <div className="absolute flex items-center justify-center w-full h-full bg-gray-100 text-gray-500 text-4xl select-none">
                      ?
                    </div>
                  )}
                </div>
                <p className="font-title inline-block font-semibold text-sm md:text-base align-middle ml-3 whitespace-nowrap">
                  {data.user?.name}
                </p>
                <div className="border-l border-gray-600 h-6" />
                <p className="text-sm md:text-base font-light text-gray-500 w-10/12 m-auto my-5">
                  {data.createdAt.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center py-20">
          <BlurImage
            src="/empty-state.png"
            alt="No Posts"
            width={613}
            height={420}
            placeholder="blur"
            blurDataURL={placeholderBlurhash}
          />
          <p className="text-2xl font-cal text-gray-600">No posts yet.</p>
        </div>
      )}

      {data.posts.length > 1 && (
        <div className="max-w-screen-xl mx-5 xl:mx-auto my-40">
          <h2 className="font-title text-4xl md:text-5xl mb-10">
            More stories
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 sm:gap-x-4 gap-y-8">
            {data.posts.slice(1).map((metadata, index) => (
              <BlogCard key={index} data={metadata} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
