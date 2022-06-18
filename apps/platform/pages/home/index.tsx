import appLink from '@/lib/domainsManagement'
import Head from 'next/head'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex flex-col h-screen ">
      <Head>
        <title>Listed</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Link href={appLink} passHref>
        <a className="absolute right-0 pr-10 pt-5">Dashboard</a>
      </Link>
      <h1 className="text-4xl text-center my-10">App Landing Page</h1>
      <div className="text-center">
        <p className="mb-5 text-xl"> This could host below list of content</p>
        <ul className=" ">
          <li>Navigation to Login, Dashboard</li>
          <li>Marketing/Advertising content</li>
        </ul>
      </div>
    </div>
  )
}
