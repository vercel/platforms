import Head from "next/head";

export default function Home() {
  return (
    <div className="flex flex-col h-screen ">
      <Head>
        <title>Listed</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className="text-4xl text-center my-10">App Landing Page</h1>
      <div className="text-center">
        <p className="mb-5 text-xl"> This could host below list of content</p>
        <ul className=" ">
          <li>Navigation to Login, Dashboard</li>
          <li>Marketing/Advertising content</li>
        </ul>
      </div>
    </div>
  );
}
