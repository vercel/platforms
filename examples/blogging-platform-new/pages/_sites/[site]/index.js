import Layout from '@/components/Layout';
import Link from 'next/link';
import { getSortedPostsData } from '@/lib/posts';
import BlurImage from '@/components/BlurImage';
import BlogCard from '@/components/BlogCard';
import Date from '@/components/Date';

export default function Blog({ allPostsData }) {
  const meta = {
    title: 'Blog – DAO Central',
    description:
      'DAO Central is a curation of the best Decentralized Autonomous Organizations (DAOs). Discover the latest DAOs, learn about their mission & values, and join the ones that you love.',
    ogUrl: 'https://daocentral.com/blog',
    ogImage: 'https://daocentral.com/thumbnail.png',
    logo: '/logo.png',
  };

  return (
    <Layout meta={meta} blog={true}>
      <div className="w-full mb-20">
        <div className="w-full max-w-screen-xl md:w-3/4 mx-auto md:mb-28">
          <Link href={`/blog/${allPostsData[0].slug}`}>
            <a>
              <div className="relative group h-80 sm:h-150 w-full mx-auto overflow-hidden md:rounded-xl">
                <BlurImage
                  src={`/blog/${allPostsData[0].image}`}
                  alt={allPostsData[0].title}
                  layout="fill"
                  objectFit="cover"
                  className="group-hover:scale-105 group-hover:duration-300"
                  placeholder="blur"
                  blurDataURL={allPostsData[0].blurhash}
                />
              </div>
              <div className="mt-10 w-5/6 mx-auto md:w-full">
                <h2 className="font-cal text-4xl md:text-6xl my-10">
                  {allPostsData[0].title}
                </h2>
                <p className="text-base md:text-lg w-full lg:w-2/3">
                  {allPostsData[0].description}
                </p>
                <div className="flex justify-start items-center space-x-4 w-full">
                  <div className="relative w-8 h-8 flex-none rounded-full overflow-hidden">
                    <BlurImage
                      layout="fill"
                      objectFit="cover"
                      src={
                        'https://pbs.twimg.com/profile_images/1431098313823047687/Y25c70l1_400x400.jpg'
                      }
                    />
                  </div>
                  <p className="inline-block font-semibold text-sm md:text-base align-middle ml-3 whitespace-nowrap">
                    Steven Tey
                  </p>
                  <div className="border-l border-gray-600 h-6" />
                  <p className="text-sm md:text-base font-light text-gray-500 w-10/12 m-auto my-5">
                    <Date dateString={allPostsData[0].date} />
                  </p>
                </div>
              </div>
            </a>
          </Link>
        </div>
      </div>

      <div className="mx-5 lg:mx-24 2xl:mx-auto mb-20 max-w-screen-xl">
        <h2 className="font-cal text-4xl md:text-5xl mb-10">More stories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-8 w-full">
          {allPostsData.slice(1).map((data, index) => (
            <BlogCard key={index} data={data} />
          ))}
        </div>
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
}
