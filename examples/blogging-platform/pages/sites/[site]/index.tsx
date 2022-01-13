import Layout from "@/components/sites/Layout"
import Loader from "@/components/Loader"
import { useRouter } from "next/router"
import Link from "next/link"
import Image from "next/image"
import React, {useState} from "react"
import prisma from '@/lib/prisma'

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }
  
export default function Index(props){
  
    const router = useRouter()
    if (router.isFallback) {
        return (
            <Loader />
        )
    }
        
    const site = JSON.parse(props.site)
    
    const pinnedPost = JSON.parse(props.pinPost)
    const [sort, setSort] = useState("date")

    return (
      <Layout
        subdomain={props.subdomain}
        siteName={site.name}
        pageTitle={site.name}
        description={site.description}
        logo={site.logo}
        thumbnail={site.image}
      >
        <main>
        <div className="bg-white pb-20 px-0 sm:px-6 lg:pb-28 lg:px-8">
          {pinnedPost != 'no pinned post' ? 
          <>
            <div className="relative w-11/12 sm:w-7/12 mx-auto lg:max-w-7xl">
              <Link href={`/p/${pinnedPost.slug}`}><a>
                <div className="grid grid-cols-1 sm:grid-cols-2 space-y-5 sm:space-x-3 py-16 hover:bg-gray-100 transition-all ease-in-out duration-100">
                  <div className="w-10/12 m-auto overflow-hidden rounded-lg">
                    <Image
                      alt={pinnedPost.title}
                      width={2048}
                      height={1170}
                      layout="responsive"
                      objectFit="cover"
                      placeholder="blur"
                      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQYV2PYsGHDfwAHNAMQumvbogAAAABJRU5ErkJggg=="
                      src={pinnedPost.image}
                      />
                  </div>
    
                  <div className="text-center sm:text-left sm:w-10/12">
                    <p className="text-3xl font-semibold text-gray-900">{pinnedPost.title}</p>
                    <p className="mt-3 text-lg text-gray-500">{pinnedPost.description}</p>
                  </div>
                </div>
              </a></Link>
            </div>
          </>
          :
          <>
            <div className="w-11/12 sm:w-7/12 mx-auto py-20 lg:max-w-7xl text-center">
              <h1 className="text-4xl font-bold mb-10">No posts yet!</h1>
              <img src="/empty-state.webp" />
            </div>
          </>
          }
          {}
          <div className="relative w-full sm:w-6/12 mt-6 mx-auto">
            <div className="flex justify-start px-3 sm:px-0 text-sm sm:text-base space-x-3 sm:space-x-8 border-b border-gray-200">
              <button
                onClick={() => setSort("date")}
                className={classNames(
                  sort == "date" ? 'text-black border-black font-semibold' : 'border-white',
                  'py-2 border-b-2'
                )}
              >
                New
              </button>
              <button
                onClick={() => setSort("likes")}
                className={classNames(
                  sort == "likes" ? 'text-black border-black font-semibold' : 'border-white',
                  'py-2 border-b-2'
                )}
              >
                Top
              </button>
              <Link href={`/about`}>
                <a className="py-2 border-b-2 border-white w-1/2 truncate">
                  What is {site.name}?
                </a>
              </Link>
            </div>
            <div className="py-5 grid gap-5">
              {site.posts.map((post) => (
                <Link href={`/p/${post.slug}`}><a>
                  <div key={post.title} className="p-8 sm:p-5 hover:bg-gray-100 transition-all ease-in-out duration-100">
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
                </a></Link>
              ))}
            </div>
          </div>
        </div>
        </main>
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

    const pinPost = data && data.posts.length > 0 ? data.posts.filter(post => {
        return post.pinnedPost.length > 0
    })[0] : 'no pinned post'

    return { 
        props: {
            subdomain: site,
            site: JSON.stringify(data),
            pinPost: JSON.stringify(pinPost)
        },
        revalidate: 10
    }
}