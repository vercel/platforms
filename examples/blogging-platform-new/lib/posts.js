import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import remark from 'remark';
import html from 'remark-html';
import { serialize } from 'next-mdx-remote/serialize';
import { getTweets } from '@/lib/twitter';
import prisma from './prisma';

const postsDirectory = path.join(process.cwd(), 'posts');

export function getSortedPostsData() {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    // Remove ".md" from file name to get slug
    const slug = fileName.replace(/\.md$/, '');

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Combine the data with the slug
    return {
      slug,
      ...matterResult.data,
    };
  });
  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getAdjacentPostsData(currentSlug) {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    // Remove ".md" from file name to get slug
    const slug = fileName.replace(/\.md$/, '');

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Combine the data with the slug
    return {
      slug,
      ...matterResult.data,
    };
  });
  allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });

  const currIdx = allPostsData.findIndex((x) => x.slug == currentSlug);
  const numPosts = allPostsData.length;
  var filteredIdx = [];
  if (numPosts - currIdx == 1 || numPosts - currIdx == numPosts) {
    // first or last post
    filteredIdx = [
      Math.abs(currIdx - 1),
      Math.abs(currIdx - 2),
      Math.abs(currIdx - 3),
    ];
  } else if (numPosts - currIdx == 2) {
    // second to last post
    filteredIdx = [currIdx - 2, currIdx - 1, currIdx + 1];
  } else {
    // second post or any other post
    filteredIdx = [currIdx - 1, currIdx + 1, currIdx + 2];
  }

  const adjacentPostData = allPostsData.filter((el, i) =>
    filteredIdx.some((j) => i === j),
  );

  // Sort posts by date
  return adjacentPostData;
}

export function getAllPostSlugs() {
  const fileNames = fs.readdirSync(postsDirectory);

  // Returns an array that looks like this:
  // [
  //   {
  //     params: {
  //       slug: 'ssg-ssr'
  //     }
  //   },
  //   {
  //     params: {
  //       slug: 'pre-rendering'
  //     }
  //   }
  // ]
  return fileNames.map((fileName) => {
    return {
      params: {
        slug: fileName.replace(/\.md$/, ''),
      },
    };
  });
}

export async function getPostData(slug) {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // Use gray-matter to parse the post metadata section
  const { content, data } = matter(fileContents);

  // Use remark to convert markdown into HTML string
  const processedContent = await remark().use(html).process(content);

  // Convert converted html to string format
  const contentHtml = processedContent.toString();

  // replace all external links
  const replaceExternalLinks = contentHtml.replace(
    /<a (href="http(s)?.+?")>(.+?)(?=<\/a>)/g,
    `<a target="_blank" $1>$3 ↗`,
  );

  // replace all internal links
  const replaceInternalLinks = replaceExternalLinks.replace(
    /<a href="\/(.+?)">(.+?)<\/a>/g,
    `<Link href="/$1"><a className="cursor-pointer">$2</a></Link>`,
  );

  // replace all DaoExamples
  const replaceDaoExamples = await replaceAsync(
    replaceInternalLinks,
    /<DaoExamples (.*)\/>/g,
    getDaoData,
  );

  // replace all DaoExamples
  const replaceTestimonials = await replaceAsync(
    replaceDaoExamples,
    /<Testimonials (.*)\/>/g,
    getTestimonialsData,
  );

  // Replace all Twitter URLs with their MDX counterparts
  const finalContentHtml = await replaceAsync(
    replaceTestimonials,
    /<p>(https?:\/\/twitter\.com\/(?:#!\/)?(\w+)\/status(?:es)?\/(\d+)([^\?])(\?.*)?<\/p>)/g,
    getTweetMetadata,
  );

  // serialize the content string into MDX
  const mdxSource = await serialize(finalContentHtml);

  // Combine the data with the slug and contentHtml
  return {
    slug,
    mdxSource,
    ...data,
  };
}

const replaceAsync = async (str, regex, asyncFn) => {
  const promises = [];
  str.replace(regex, (match, ...args) => {
    const promise = asyncFn(match, ...args);
    promises.push(promise);
  });
  const data = await Promise.all(promises);
  return str.replace(regex, () => data.shift());
};

const getTweetMetadata = async (tweetUrl) => {
  const regex = /\/status\/(\d+)/gm;
  const id = regex.exec(tweetUrl)[1];
  const tweetData = await getTweets(id);
  const tweetMDX =
    "<Tweet id='" + id + "' metadata={`" + JSON.stringify(tweetData) + '`}/>';
  return tweetMDX;
};

const getDaoData = async (str) => {
  const regex = /slugs=\[(.+)\]/gm;
  const raw = regex.exec(str);
  const slugs = raw[1].split(',');
  let data = [];
  for (let i = 0; i < slugs.length; i++) {
    const results = await prisma.dao.findUnique({
      where: {
        slug: slugs[i],
      },
      select: {
        name: true,
        slug: true,
        emoji: true,
        slogan: true,
        sloganShort: true,
        imageUrl: true,
        imageBlurhash: true,
      },
    });
    data.push(results);
  }
  return `<DaoExamples data={${JSON.stringify(data)}} />`;
};

const getTestimonialsData = async (str) => {
  const regex = /tweets=\[(.+)\]/gm;
  const raw = regex.exec(str);
  const tweets = raw[1].split(',');
  let data = [];
  for (let i = 0; i < tweets.length; i++) {
    const tweetData = await getTweets(tweets[i]);
    data.push(tweetData);
  }
  return `<Testimonials data={${JSON.stringify(data)}} />`;
};
