// pages/[id]/archive.tsx

import Layout from '@/components/sites/Layout'
import Loader from "@/components/Loader"
import { useRouter } from "next/router"
import prisma from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'

export default function Archive (props) {

  
    const router = useRouter()
    if (router.isFallback) {
        return (
            <Loader />
        )
    }

    const site = JSON.parse(props.site)

    return (
        <Layout
            subdomain={props.subdomain}
            siteName={site.name}
            pageTitle={site.name}
            description={site.description}
            logo={site.logo}
            thumbnail={props.image}
        >
      
            <div className="relative w-full md:w-1/2 mt-6 mx-auto">
                <div className="flex justify-start px-3 sm:px-8 text-sm sm:text-base space-x-3 sm:space-x-8">
                    <div className="text-black border-black font-semibold py-2 border-b-2">
                    Archive
                    </div>
                </div>
                <div className="py-5 grid gap-5">
                    {site.posts.map((post) => (
                    <Link href={`/p/${post.slug}`}><a>
                        <div key={post.title} className="grid grid-cols-1 md:grid-cols-7 sm:space-x-8 px-8 py-2 hover:bg-gray-100 transition-all ease-in-out duration-100">
                            <div className="w-full col-span-2 m-auto overflow-hidden rounded-lg">
                                <Image
                                width={2048}
                                height={1200}
                                layout="responsive"
                                objectFit="cover"
                                placeholder="blur"
                                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQYV2PYsGHDfwAHNAMQumvbogAAAABJRU5ErkJggg=="
                                src={post.image}
                                />
                            </div>

                            <div className="text-center sm:text-left col-span-5 py-5">
                                <p className="text-sm text-gray-500">
                                    <time dateTime={post.createdAt}>
                                    {`${Intl.DateTimeFormat('en', { month: 'short' }).format(new Date(post.createdAt))} ${Intl.DateTimeFormat('en', { day: '2-digit' }).format(new Date(post.createdAt))}`}
                                    </time>
                                </p>
                                <div className="mt-2 block">
                                    <p className="text-2xl font-semibold text-gray-900">{post.title}</p>
                                    <p className="mt-3 text-base text-gray-500">{post.description}</p>
                                </div>
                                <div className="mt-3">
                                    <p className="text-base font-semibold text-black hover:text-gray-800">
                                    Read full story
                                    </p>
                                </div>
                            </div>
                        </div>
                    </a></Link>
                    ))}
                </div>
            </div>

            <div className="h-350 w-screen"></div>

        </Layout>

    )
}

export async function getStaticPaths() {
    const subdomains = await prisma.site.findMany({
        select: {
            url: true,
        }
    })
    const customDomains = await prisma.site.findMany({
        where: {
          NOT: {
            customDomain: null
          }
        },
        select: {
            customDomain: true,
        }
    })
    const allPaths = [...subdomains.map((subdomain) => {return subdomain.url}), ...customDomains.map((customDomain) => {return customDomain.customDomain})]
    return {
        paths: allPaths.map((path) => {
            return  { params: { site: path } }
        }),
        fallback: true
    }
}

export async function getStaticProps({ params: {site} }) {

    let filter = {
      url: site
    }
    if (site.includes('.')) {
      filter = {
        customDomain: site
      }
    }
  
    const data = await prisma.site.findUnique({
        where: filter,
        include: {
            posts: {  
            where: {
                published: true,
            },
            include: {
                pinnedPost: true
            },
            orderBy: [
                {
                createdAt: 'desc',
                }
            ]
            },
        }
    })
    
    if (!data) {
        return { notFound: true, revalidate: 10 };
    }

    return { 
        props: {
            subdomain: site,
            site: JSON.stringify(data),
        },
        revalidate: 10
    }
}