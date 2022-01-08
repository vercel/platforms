import Layout from '@/components/Layout';
import {
  getAllPostSlugs,
  getPostData,
  getAdjacentPostsData,
} from '@/lib/posts';
import Link from 'next/link';
import Tweet from '@/components/mdx/Tweet';
import Testimonials from '@/components/mdx/Testimonials';
import { MDXRemote } from 'next-mdx-remote';
import BlurImage from '@/components/BlurImage';
import BlogCard from '@/components/BlogCard';
import ProfileCard from '@/components/mdx/ProfileCard';
import DaoExamples from '@/components/mdx/DaoExamples';
import Date from '@/components/Date';

const components = {
  Tweet,
  Link,
  DaoExamples,
  BlurImage,
  ProfileCard,
  Testimonials,
};

export default function Post({ postData, adjacentPosts }) {
  const meta = {
    title: `${postData.title} – DAO Central`,
    description: postData.description,
    ogUrl: `https://daocentral.com/blog/${postData.slug}`,
    ogImage: `https://daocentral.com/blog/${postData.image}`,
    logo: '/logo.png',
  };

  return (
    <Layout meta={meta} blog={true}>
      <div className="flex flex-col justify-center items-center">
        <div className="text-center w-full md:w-7/12 m-auto">
          <p className="text-sm md:text-base font-light text-gray-500 w-10/12 m-auto my-5">
            <Date dateString={postData.date} />
          </p>
          <h1 className="font-bold text-3xl font-cal md:text-6xl mb-10 text-gray-800">
            {postData.title}
          </h1>
          <p className="text-md md:text-lg text-gray-600 w-10/12 m-auto">
            {postData.description}
          </p>
        </div>
        <a target="_blank" href="https://twitter.com/StevenTey">
          <div className="my-8">
            <div className="relative w-8 h-8 md:w-12 md:h-12 rounded-full overflow-hidden inline-block align-middle">
              <BlurImage
                width={80}
                height={80}
                src={
                  'https://pbs.twimg.com/profile_images/1431098313823047687/Y25c70l1_400x400.jpg'
                }
              />
            </div>
            <div className="inline-block text-md md:text-lg align-middle ml-3">
              by <span className="font-semibold">Steven Tey</span>
            </div>
          </div>
        </a>
      </div>
      <div className="relative h-80 md:h-150 w-full max-w-screen-lg lg:2/3 md:w-5/6 m-auto mb-10 md:mb-20 md:rounded-2xl overflow-hidden">
        <BlurImage
          layout="fill"
          objectFit="cover"
          placeholder="blur"
          blurDataURL={postData.blurhash}
          src={`/blog/${postData.image}`}
        />
      </div>

      <article className="w-11/12 sm:w-3/4 m-auto prose prose-md sm:prose-lg">
        <MDXRemote {...postData.mdxSource} components={components} />
      </article>

      <div className="relative mt-10 sm:mt-20 mb-20">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center">
          <span className="px-2 bg-white text-sm text-gray-500">
            Continue Reading
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-8 mx-5 lg:mx-12 2xl:mx-auto mb-20 max-w-screen-xl">
        {adjacentPosts.map((data, index) => (
          <BlogCard key={index} data={data} />
        ))}
      </div>
    </Layout>
  );
}

export async function getStaticPaths() {
  const paths = getAllPostSlugs();
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const postData = await getPostData(params.slug);
  const adjacentPosts = await getAdjacentPostsData(params.slug);

  return {
    props: {
      postData,
      adjacentPosts,
    },
    revalidate: 1800,
  };
}
