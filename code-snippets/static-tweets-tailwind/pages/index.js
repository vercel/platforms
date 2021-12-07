import Head from 'next/head'
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemote } from 'next-mdx-remote';
import Tweet from '@/components/Tweet'
import { getTweets } from '@/lib/twitter';

const components = {
  Tweet
};

export default function Home(props) {

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>Static Tweets (Tailwind)</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center w-full flex-1 text-center">

        <article className="prose lg:prose-xl w-full max-w-lg mx-auto mt-20 mb-48">
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
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel Logo" className="h-4 ml-2" />
        </a>
      </footer>
    </div>
  )
}

export async function getStaticProps() {
  
  const contentHtml = `<h1>Static tweets</h1> <p>https://twitter.com/steventey/status/1458527553728090115?s=20</p>`
  
  // Replace all Twitter URLs with their MDX counterparts
  const finalContentHtml = await replaceAsync(contentHtml, /<p>(https?:\/\/twitter\.com\/(?:#!\/)?(\w+)\/status(?:es)?\/(\d+)([^\?]+)(\?.*)?<\/p>)/g, getTweetMetadata)
  
  // serialize the content string into MDX
  const mdxSource = await serialize(finalContentHtml);

  return {
      props: {
          content: mdxSource,
      }
  }
}

const replaceAsync = async (str, regex, asyncFn) => {
  const promises = [];
  str.replace(regex, (match, ...args) => {
      const promise = asyncFn(match, ...args);
      promises.push(promise);
  });
  const data = await Promise.all(promises);
  return str.replace(regex, () => data.shift());
}

const getTweetMetadata = async (tweetUrl) => {
  const regex = /\/status\/(\d+)/gm;
  const id = regex.exec(tweetUrl)[1]
  const tweetData = await getTweets(id)
  const tweetMDX = "<Tweet id='"+id+"' metadata={`"+JSON.stringify(tweetData)+"`}/>"
  return tweetMDX
}