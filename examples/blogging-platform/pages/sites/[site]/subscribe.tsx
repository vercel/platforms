// pages/drafts.tsx

import React, {useState} from 'react'
import Layout from '@/components/sites/Layout'
import Loader from "@/components/Loader"
import { useRouter } from "next/router"
import prisma from '@/lib/prisma'
import { MailIcon } from '@heroicons/react/solid'

export default function Subscribe (props) {

    const router = useRouter()
    if (router.isFallback) {
        return (
            <Loader />
        )
    }

    const [subscribing, setSubscribing] = useState(false)

    return (
        <Layout
            subdomain={props.subdomain}
            siteName={props.name}
            pageTitle={props.name}
            description={props.description}
            logo={props.logo}
            thumbnail={props.image}
        >
        <div className="relative m-auto mt-48 sm:w-1/2 bg-white overflow-hidden">
            <h1 className="block text-2xl text-center leading-8 font-bold tracking-tight text-gray-900 sm:text-4xl">
                Subscribe to {props.name}
            </h1>
            <div className="w-11/12 sm:w-2/3 mx-auto my-16">
                <form 
                    onSubmit={(e) => {
                        e.preventDefault()
                        setSubscribing(true)
                        console.log(e.target.email.value)
                    }}
                    className="mt-1 relative rounded-md shadow-sm"
                >
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MailIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                    type="text"
                    name="email"
                    required
                    className="focus:outline-none focus:ring-0 focus:border-gray-300 inline-block w-2/3 h-14 pl-10 sm:text-lg border-gray-300 border border-r-0 rounded-l-md"
                    placeholder="you@example.com"
                    />
                    <button 
                        type="submit"
                        className="inline-block bg-black hover:bg-gray-800 font-semibold sm:text-lg text-white w-1/3 h-14 px-5 border border-black rounded-r-md"
                    >
                        {subscribing?
                        <>
                            <svg
                            className="animate-spin mx-auto h-6 w-6 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                stroke-width="4"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                            </svg>
                        </>
                        : "Subscribe"}
                    </button>
                </form>
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

export async function getStaticProps({params: { site }}) {

    let filter = {
        url: site
    }
      if (site.includes('.')) {
        filter = {
            customDomain: site
        }
    }
    const data = await prisma.site.findUnique({
        where: filter
    })
    
    if (!data) {
        return { notFound: true, revalidate: 10 };
    }

    return {
        props: {
            subdomain: site,
            ...data
        },
        revalidate: 10
    }
}