import Layout from "@/components/sites/Layout";
import Link from "next/link";
import { useRouter } from "next/router";
import BlurImage from "@/components/BlurImage";
import BlogCard from "@/components/BlogCard";
import Loader from "@/components/sites/Loader";
import Date from "@/components/Date";
import prisma from "@/lib/prisma";

import type { GetStaticPaths, GetStaticProps } from "next";
import type { _SiteData, Meta } from "@/types";
import type { ParsedUrlQuery } from "querystring";
import { placeholderBlurhash } from "@/lib/util";

interface PathProps extends ParsedUrlQuery {
  site: string;
}

interface IndexProps {
  stringifiedData: string;
}

export default function Index({ stringifiedData }: IndexProps) {
  const router = useRouter();
  if (router.isFallback) return <Loader />;

  const data = JSON.parse(stringifiedData) as _SiteData;

  const meta = {
    title: data.name,
    description: data.description,
    logo: "/logo.png",
    ogImage: data.image,
    ogUrl: data.customDomain
      ? data.customDomain
      : `https://${data.subdomain}.vercel.pub`,
  } as Meta;

  return (
    <Layout meta={meta} subdomain={data.subdomain ?? undefined}>
      <div className="w-full mb-20">
        {data.posts.length > 0 ? (
          <div className="w-full max-w-screen-xl lg:w-5/6 mx-auto md:mb-28">
            <Link href={`/${data.posts[0].slug}`}>
              <div className="relative group h-80 sm:h-150 w-full mx-auto overflow-hidden lg:rounded-xl">
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
              <div className="mt-10 w-5/6 mx-auto lg:w-full">
                <h2 className="font-cal text-4xl md:text-6xl my-10">
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
                  <p className="inline-block font-semibold text-sm md:text-base align-middle ml-3 whitespace-nowrap">
                    {data.user?.name}
                  </p>
                  <div className="border-l border-gray-600 h-6" />
                  <p className="text-sm md:text-base font-light text-gray-500 w-10/12 m-auto my-5">
                    <Date dateString={data.posts[0].createdAt.toString()} />
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
      </div>

      {data.posts.length > 1 && (
        <div className="mx-5 lg:mx-24 2xl:mx-auto mb-20 max-w-screen-xl">
          <h2 className="font-cal text-4xl md:text-5xl mb-10">More stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-8 w-full">
            {data.posts.slice(1).map((metadata, index) => (
              <BlogCard key={index} data={metadata} />
            ))}
          </div>
        </div>
      )}
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths<PathProps> = async () => {
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

  return {
    paths: allPaths.map((path) => ({
      params: {
        site: path,
      },
    })),
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps<IndexProps, PathProps> = async ({
  params,
}) => {
  if (!params) throw new Error("No path parameters found");

  const { site } = params;

  let filter: {
    subdomain?: string;
    customDomain?: string;
  } = {
    subdomain: site,
  };

  if (site.includes(".")) {
    filter = {
      customDomain: site,
    };
  }

  const data = (await prisma.site.findUnique({
    where: filter,
    include: {
      user: true,
      posts: {
        where: {
          published: true,
        },
        orderBy: [
          {
            createdAt: "desc",
          },
        ],
      },
    },
  })) as _SiteData;

  if (!data) return { notFound: true, revalidate: 10 };

  return {
    props: {
      stringifiedData: JSON.stringify(data),
    },
    revalidate: 3600,
  };
};
