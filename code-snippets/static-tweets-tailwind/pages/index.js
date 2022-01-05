import Head from "next/head";
import Image from "next/image";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote } from "next-mdx-remote";
import Tweet from "@/components/Tweet";
import { getTweets } from "@/lib/twitter";

const components = {
  Tweet,
};

export default function Home(props) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>Static Tweets (Tailwind)</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* added link to github repo */}
      <a
        href="https://github.com/vercel-customer-feedback/platforms/tree/main/code-snippets/static-tweets-tailwind"
        target="_blank"
        className="fixed top-5 right-5"
      >
        <Image src="/github.svg" alt="Github" width={24} height={24} />
      </a>

      <main className="flex flex-col items-center justify-center w-full flex-1">
        <article className="prose lg:prose-xl w-11/12 max-w-3xl mx-auto mt-20 mb-48">
          <MDXRemote {...props.content} components={components} />
        </article>
      </main>

      <footer className="flex items-center justify-center w-full h-24 border-t">
        <a
          className="flex items-center justify-center"
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <img src="/vercel.svg" alt="Vercel Logo" className="h-4 ml-2" />
        </a>
      </footer>
    </div>
  );
}

export async function getStaticProps() {
  const contentHtml = `
  <h2>Regular Tweets</h2> 
  <p>https://twitter.com/steventey/status/1438526338567081984?s=20</p>
  <h2>Image Tweets</h2> 
  <p>https://twitter.com/steventey/status/1460689767289405444?s=20</p>
  <h2>GIF Tweets</h2> 
  <p>https://twitter.com/steventey/status/1473329920470355976?s=20</p>
  <h2>Video Tweets</h2>
  <p>https://twitter.com/DAOCentral/status/1474469391232237569</p>
  <h2>Multiple Images</h2>
  <p>https://twitter.com/jstngraphics/status/1477021464620515328?s=20</p>
  <h2>Link Preview</h2>
  <p>https://twitter.com/steventey/status/1463554409242062849?s=20</p>
  <h2>Quote Retweet</h2>
  <p>https://twitter.com/steventey/status/1472640347914137606?s=20</p>
  <h2>Quote Retweet with Image In Parent</h2>
  <p>https://twitter.com/steventey/status/1467713086459047940?s=20</p>
  <h2>Poll Tweet</h2>
  <p>https://twitter.com/DAOCentral/status/1475184169588125699</p>
  `;

  // Replace all Twitter URLs with their MDX counterparts
  const finalContentHtml = await replaceAsync(
    contentHtml,
    /<p>(https?:\/\/twitter\.com\/(?:#!\/)?(\w+)\/status(?:es)?\/(\d+)([^\?])(\?.*)?<\/p>)/g,
    getTweetMetadata
  );

  // serialize the content string into MDX
  const mdxSource = await serialize(finalContentHtml);

  return {
    props: {
      content: mdxSource,
    },
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
    "<Tweet id='" + id + "' metadata={`" + JSON.stringify(tweetData) + "`}/>";
  return tweetMDX;
};
