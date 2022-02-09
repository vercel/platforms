import Layout from "@/components/sites/Layout";
import Link from "next/link";
import Tweet from "@/components/mdx/Tweet";
import { remark } from "remark";
import remarkMdx from "remark-mdx";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote } from "next-mdx-remote";
import BlurImage from "@/components/BlurImage";
import BlogCard from "@/components/BlogCard";
import Examples from "@/components/mdx/Examples";
import Date from "@/components/Date";
import prisma from "@/lib/prisma";
import { useRouter } from "next/router";
import Loader from "@/components/sites/Loader";
import {
  replaceLinks,
  replaceTweets,
  replaceExamples,
} from "@/lib/remark-plugins";

const components = {
  Tweet,
  BlurImage,
  Examples,
  a: replaceLinks,
};

export default function Post(props) {
  const router = useRouter();
  if (router.isFallback) {
    return <Loader />;
  }

  const data = JSON.parse(props.stringifiedData);
  const adjacentPosts = JSON.parse(props.stringifiedAdjacentPosts);

  const meta = {
    title: data.title,
    description: data.description,
    ogUrl: `https://${data.site.subdomain}.vercel.pub/${data.slug}`,
    ogImage: data.image,
    logo: "/logo.png",
  };

  return (
    <Layout meta={meta} subdomain={data.site.subdomain}>
      <div className="flex flex-col justify-center items-center">
        <div className="text-center w-full md:w-7/12 m-auto">
          <p className="text-sm md:text-base font-light text-gray-500 w-10/12 m-auto my-5">
            <Date dateString={data.createdAt} />
          </p>
          <h1 className="font-bold text-3xl font-cal md:text-6xl mb-10 text-gray-800">
            {data.title}
          </h1>
          <p className="text-md md:text-lg text-gray-600 w-10/12 m-auto">
            {data.description}
          </p>
        </div>
        <a
          target="_blank"
          // if you are using Github OAuth, you can get rid of the Twitter option
          href={
            data.site.user.username
              ? `https://twitter.com/${data.site.user.username}`
              : `https://github.com/${data.site.user.gh_username}`
          }
        >
          <div className="my-8">
            <div className="relative w-8 h-8 md:w-12 md:h-12 rounded-full overflow-hidden inline-block align-middle">
              <BlurImage width={80} height={80} src={data.site.user.image} />
            </div>
            <div className="inline-block text-md md:text-lg align-middle ml-3">
              by <span className="font-semibold">{data.site.user.name}</span>
            </div>
          </div>
        </a>
      </div>
      <div className="relative h-80 md:h-150 w-full max-w-screen-lg lg:2/3 md:w-5/6 m-auto mb-10 md:mb-20 md:rounded-2xl overflow-hidden">
        <BlurImage
          layout="fill"
          objectFit="cover"
          placeholder="blur"
          blurDataURL={data.imageBlurhash}
          src={data.image}
        />
      </div>

      <article className="w-11/12 sm:w-3/4 m-auto prose prose-md sm:prose-lg">
        <MDXRemote {...data.mdxSource} components={components} />
      </article>

      {adjacentPosts.length > 0 && (
        <div className="relative mt-10 sm:mt-20 mb-20">
          <div
            className="absolute inset-0 flex items-center"
            aria-hidden="true"
          >
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center">
            <span className="px-2 bg-white text-sm text-gray-500">
              Continue Reading
            </span>
          </div>
        </div>
      )}
      {adjacentPosts && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-8 mx-5 lg:mx-12 2xl:mx-auto mb-20 max-w-screen-xl">
          {adjacentPosts.map((data, index) => (
            <BlogCard key={index} data={data} />
          ))}
        </div>
      )}
    </Layout>
  );
}

export async function getStaticPaths() {
  const posts = await prisma.post.findMany({
    where: {
      published: true,
      // you can remove this if you want to generate all sites at build time
      site: {
        subdomain: "demo",
      },
    },
    select: {
      slug: true,
      site: {
        select: {
          subdomain: true,
          customDomain: true,
        },
      },
    },
  });
  return {
    paths: posts.flatMap((post) => {
      if (post.site.customDomain) {
        return [
          { params: { site: post.site.customDomain, slug: post.slug } },
          { params: { site: post.site.subdomain, slug: post.slug } },
        ];
      } else {
        return { params: { site: post.site.subdomain, slug: post.slug } };
      }
    }),
    fallback: true,
  };
}

export async function getStaticProps({ params: { site, slug } }) {
  let constraint = {
    site: {
      subdomain: site,
    },
  };
  if (site.includes(".")) {
    constraint = {
      site: {
        customDomain: site,
      },
    };
  }
  let data = await prisma.post.findFirst({
    where: { ...constraint, slug: slug },
    include: {
      site: {
        include: {
          user: true,
        },
      },
    },
  });

  if (!data) {
    return { notFound: true, revalidate: 10 };
  }

  data.mdxSource = await getMdxSource(data.content);

  const adjacentPosts = await prisma.post.findMany({
    where: {
      ...constraint,
      published: true,
      NOT: {
        id: data.id,
      },
    },
    select: {
      slug: true,
      title: true,
      createdAt: true,
      description: true,
      image: true,
      imageBlurhash: true,
    },
  });

  return {
    props: {
      stringifiedData: JSON.stringify(data),
      stringifiedAdjacentPosts: JSON.stringify(adjacentPosts),
    },
    revalidate: 3600,
  };
}

async function getMdxSource(postContents) {
  // Use remark plugins to convert markdown into HTML string
  const processedContent = await remark()
    .use(remarkMdx) // native remark plugin that parses markdown into MDX
    .use(replaceTweets) // replaces tweets with static <Tweet /> component
    .use(() => replaceExamples(prisma)) // replaces examples with <Example /> component (only for demo.vercel.pub)
    .process(postContents);

  // Convert converted html to string format
  const contentHtml = String(processedContent);

  // serialize the content string into MDX
  const mdxSource = await serialize(contentHtml);

  return mdxSource;
}
