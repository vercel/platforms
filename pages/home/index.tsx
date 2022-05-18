import Head from "next/head";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex h-screen bg-black">
      <Head>
        <title>Listed</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="m-auto w-48">
        <h1>Application Landing Page</h1>
        <p> This could host below list of content</p>
        <ul>
          <li>Navigation to Login, Dashboard</li>
          <li>Marketing/Advertising content</li>
        </ul>
      </div>
    </div>
  );
}
