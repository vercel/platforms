import Link from "next/link";
import { notFound } from "next/navigation";
import BlurImage from "@/components/blur-image";
import { placeholderBlurhash, toDateString } from "@/lib/utils";
import BlogCard from "@/components/blog-card";
import { getPostsForSite, getSiteData } from "@/lib/fetchers";
import Image from "next/image";

export default async function SiteHomePage({
  params,
}: {
  params: { domain: string };
}) {
  const [data, posts] = await Promise.all([
    getSiteData(params.domain),
    getPostsForSite(params.domain),
  ]);

  if (!data) {
    notFound();
  }

  return (
    <>
      <div className="w-full mb-20">
        {posts.length > 0 ? (
          <div className="w-full max-w-screen-xl lg:w-5/6 mx-auto md:mb-28">
            <Link href={`/${posts[0].slug}`}>
              <div className="relative group h-80 sm:h-150 w-full mx-auto overflow-hidden lg:rounded-xl">
                <BlurImage
                  alt={posts[0].title ?? ""}
                  blurDataURL={posts[0].imageBlurhash ?? placeholderBlurhash}
                  className="group-hover:scale-105 group-hover:duration-300 h-full w-full object-cover"
                  width={1300}
                  height={630}
                  placeholder="blur"
                  src={posts[0].image ?? "/placeholder.png"}
                />
              </div>
              <div className="mt-10 w-5/6 mx-auto lg:w-full">
                <h2 className="font-title text-4xl md:text-6xl my-10">
                  {posts[0].title}
                </h2>
                <p className="text-base md:text-lg w-full lg:w-2/3">
                  {posts[0].description}
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
                  <p className="inline-block font-semibold text-sm md:text-base align-middle ml-3 whitespace-nowrap">
                    {data.user?.name}
                  </p>
                  <div className="border-l border-gray-600 h-6" />
                  <p className="text-sm md:text-base font-light text-gray-500 w-10/12 m-auto my-5">
                    {toDateString(posts[0].createdAt)}
                  </p>
                </div>
              </div>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center py-20">
            <Image
              alt="missing post"
              src="https://illustrations.popsy.co/gray/success.svg"
              width={400}
              height={400}
            />
            <p className="text-2xl font-title text-gray-600">No posts yet.</p>
          </div>
        )}
      </div>

      {posts.length > 1 && (
        <div className="mx-5 lg:mx-24 2xl:mx-auto mb-20 max-w-screen-xl">
          <h2 className="font-title text-4xl md:text-5xl mb-10">
            More stories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-8 w-full">
            {posts.slice(1).map((metadata, index) => (
              <BlogCard key={index} data={metadata} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
