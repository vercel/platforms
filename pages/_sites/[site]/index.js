import Layout from "@/components/sites/Layout";
import Link from "next/link";
import { useRouter } from "next/router";
import BlurImage from "@/components/BlurImage";
import BlogCard from "@/components/BlogCard";
import Loader from "@/components/sites/Loader";
import Date from "@/components/Date";
import prisma from "@/lib/prisma";

export default function Index(props) {
  const router = useRouter();
  if (router.isFallback) {
    return <Loader />;
  }

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
    <Layout meta={meta} subdomain={data.subdomain}>
      <div className="w-full mb-20">
        {data.posts.length > 0 ? (
          <div className="w-full max-w-screen-xl lg:w-5/6 mx-auto md:mb-28">
            <Link href={`/${data.posts[0].slug}`}>
              <a>
                <div className="relative group h-80 sm:h-150 w-full mx-auto overflow-hidden lg:rounded-xl">
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
                <div className="mt-10 w-5/6 mx-auto lg:w-full">
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
        ) : (
          <div className="flex flex-col justify-center items-center py-20">
            <BlurImage
              src="/empty-state.png"
              alt="No Posts"
              width={613}
              height={420}
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAA6ZJREFUWEe1VwFuGzEMk2///+8uydmDSFGWfdduKLAUQYqsiyiKpJQ2xhj2t4f/RR82RreO18FX/xlm+oDWzKw1a63Z4c+Dz3YcX1ZoPwLQh/VBIF48O2he/78BiO57R3ECMIDAw7s3L27WvGswcCQT+IeHx78x4HR7Ye9cIygM5Oc+MnBgDD8HkDPvNgJAHz27XwRUAfj8G4tTBxDIjYPvGfAuUfSJfo7AH/4SE5gaQOE5Av/9iYWvAWzFvWvQXwVYDQTxFRF68dTCBLODeAYQImPnon7VgBxQOYUDQL1e5wj4njNCq2ocNwD4YPicxSm8+bsYcP7r/GW/BFE0IFBiBH8D0zQrADhTCKzM3YtfVQMhSrIf03fq/adSro4XRmhPPsO93av5R8lWpTgLx/Ny788k9No1ATOAQnjoOoTITFiL+3sg4epXhiE9ziIofrE4fycAx0uwMX11X4pA/bJfWHGCCOojvdr780EvSrU6dy98BYj5PgEU82X2q4gAZBo+da8RvN7vGwBR78UnEyHGGJX4l6Co8Ek7KQ8rSgfwqawaGjhfr0UDolydJ4gtimU/iK/ZLXS0BaclqQFuS7oQ//d8nWAUqzWiFtRj7hdGMEeh+U8DEkB0rgWkFIxVLBC5rmVBx/H7PJMBbLlQPQqX4hqLRFgZyC4lvtwBcwQ1J9h9iHEBgJjdCl8XnQAxcg0jhAY/5L7/vahccCzJmP6XBR3IIwOl8w8KcxRax0rBnwEIIYqB83whVNnYzACOYNeAr+Gwoe6Q5QKanSuEMoA2K4YKXYTFBQqgEGHqwIFEQtYg0gqGBm4CLIvoONYIzihu1pADxQV7BogJ2pNOSRZ4hH3jgpIDhQFYMc44JmHcdtqCsl3aT4GkpRRC1DGIHCjXD0Wo4gyouqaVAXi9PheDdVnDg/MP9e9xXBnQIYoUbKH64oJcSCUN5/lu1rrzGgCYA3sWEIgvJn/d7wGMwEdRL+ESRIslyyrObYhVuIyAAOoikhjzQsptyHsg7agVjHEcdvyqdyHZURbkDsldHCBuDJTusZ5xK8ZVHBtJQty3Ye1+2Q2xkKDD5ZuRg4gRLG74diXrC0lxQ45gzYX9MLkD8He6zSNEEby7YLOibDVvv1p4i+UaSDcG4sxzFpaLSJfRPoJylueyKafYPgJ9T6g74fEsH85CLbpdRvp2LPekosNqa+FtDPE3ukqfvxdoDBuIeq4td2Gc+uxsjeB0Q1nRPEx4lPwBA2anSbfNT08AAAAASUVORK5CYII="
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

export async function getStaticPaths() {
  const subdomains = await prisma.site.findMany({
    // you can remove this if you want to generate all sites at build time
    where: {
      subdomain: "demo",
    },
    select: {
      subdomain: true,
    },
  });
  const customDomains = await prisma.site.findMany({
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
    revalidate: 3600,
  };
}
