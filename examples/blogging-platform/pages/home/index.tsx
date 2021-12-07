import Head from 'next/head'
import Image from 'next/image'

export default function Home() {
  return (
    <div className="flex h-screen">
      <Head>
        <title>Platforms on Vercel</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="m-auto w-1/2">
        <Image 
          width={4748}
          height={940}
          src="/banner.png"
          alt="Platforms on Vercel"
        />
      </div>
    </div>
  )
}
