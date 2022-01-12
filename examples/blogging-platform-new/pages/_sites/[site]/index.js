import Layout from "@/components/sites/Layout";
import Link from "next/link";
import BlurImage from "@/components/BlurImage";
import BlogCard from "@/components/BlogCard";
import Date from "@/components/Date";
import prisma from "@/lib/prisma";

export default function Blog(props) {
  const data = JSON.parse(props.data);

  const meta = {
    title: data.name,
    description: data.description,
    ogUrl: data.customDomain
      ? data.customDomain
      : `https://${data.subdomain}.vercel.pub`,
    ogImage: data.image,
    logo: "/logo.png",
  };

  return (
    <Layout meta={meta}>
      <div className="w-full mb-20">
        <div className="w-full max-w-screen-xl md:w-3/4 mx-auto md:mb-28">
          <Link href={`/${data.posts[0].slug}`}>
            <a>
              <div className="relative group h-80 sm:h-150 w-full mx-auto overflow-hidden md:rounded-xl">
                <BlurImage
                  src={data.posts[0].image}
                  alt={data.posts[0].title}
                  layout="fill"
                  objectFit="cover"
                  className="group-hover:scale-105 group-hover:duration-300"
                  placeholder="blur"
                  blurDataURL={data.posts[0].imageBlurhash}
                />
              </div>
              <div className="mt-10 w-5/6 mx-auto md:w-full">
                <h2 className="font-cal text-4xl md:text-6xl my-10">
                  {data.posts[0].title}
                </h2>
                <p className="text-base md:text-lg w-full lg:w-2/3">
                  {data.posts[0].description}
                </p>
                <div className="flex justify-start items-center space-x-4 w-full">
                  <div className="relative w-8 h-8 flex-none rounded-full overflow-hidden">
                    <BlurImage
                      layout="fill"
                      objectFit="cover"
                      src={data.user.image}
                    />
                  </div>
                  <p className="inline-block font-semibold text-sm md:text-base align-middle ml-3 whitespace-nowrap">
                    {data.user.name}
                  </p>
                  <div className="border-l border-gray-600 h-6" />
                  <p className="text-sm md:text-base font-light text-gray-500 w-10/12 m-auto my-5">
                    <Date dateString={data.posts[0].createdAt} />
                  </p>
                </div>
              </div>
            </a>
          </Link>
        </div>
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

export async function getStaticPaths() {
  const subdomains = await prisma.site.findMany({
    select: {
      subdomain: true,
    },
  });
  const customDomains = await prisma.site.findMany({
    where: {
      NOT: {
        customDomain: null,
      },
    },
    select: {
      customDomain: true,
    },
  });
  const allPaths = [
    ...subdomains.map((subdomain) => {
      return subdomain.subdomain;
    }),
    ...customDomains.map((customDomain) => {
      return customDomain.customDomain;
    }),
  ];
  return {
    paths: allPaths.map((path) => {
      return { params: { site: path } };
    }),
    fallback: true,
  };
}

export async function getStaticProps({ params: { site } }) {
  let filter = {
    subdomain: site,
  };
  if (site.includes(".")) {
    filter = {
      customDomain: site,
    };
  }
  const data = await prisma.site.findUnique({
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
  });

  if (!data) {
    return { notFound: true, revalidate: 10 };
  }

  return {
    props: {
      data: JSON.stringify(data),
    },
    revalidate: 10,
  };
}
