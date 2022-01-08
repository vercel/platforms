import React from 'react'
import Layout from '@/components/sites/Layout'
import Loader from "@/components/Loader"
import { useRouter } from "next/router"
import Image from 'next/image'
import matter from 'gray-matter'
import remark from 'remark'
import html from 'remark-html'
import prisma from '@/lib/prisma'
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemote } from 'next-mdx-remote';
import Tweet from '@/components/sites/Tweet'
import { getTweets } from '@/lib/twitter';

const components = {
    Tweet
};

export default function PostPage (props) {
  
    const router = useRouter()
    if (router.isFallback) {
        return (
            <Loader />
        )
    }
    let post = JSON.parse(props.post)

    return (
        <Layout
            subdomain={props.subdomain}
            siteName={props.site.name}
            pageTitle={post.title}
            description={post.description}
            logo={props.site.logo}
            thumbnail={post.image}
        >
        <div className="relative m-auto mt-20 sm:w-1/2 text-center bg-white overflow-hidden">
            <h1 className="mt-2 block text-4xl text-center leading-8 font-extrabold tracking-tight text-gray-900 sm:text-6xl">
                {post.title}
            </h1>
            <p className="mt-16 text-2xl text-gray-500 leading-8">
            {post.description}
            </p>
        </div>
        <div className="w-full sm:w-8/12 mx-auto mt-16 overflow-hidden sm:rounded-lg shadow-2xl">
            <Image
                width={2048}
                height={1170}
                layout="responsive"
                objectFit="cover"
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQYV2PYsGHDfwAHNAMQumvbogAAAABJRU5ErkJggg=="
                src={post.image}
            />
        </div>

        <article className="prose lg:prose-xl w-10/12 sm:w-full mx-auto mt-20 mb-48">
            <MDXRemote {...props.content} components={components} />
        </article>

        </Layout>
    )
}

export async function getStaticPaths() {
    const posts = await prisma.post.findMany({
        where: {
            published: true,
        },
        select: {
            siteUrl: true,
            slug: true,
            Site: {
                select: {
                    customDomain: true
                }
            }
        }
    })
    return {
        paths: posts.flatMap((post) => {
            if (post.Site?.customDomain) {
                return  [{ params: { site: post.Site.customDomain, slug: post.slug } }, {params: { site: post.siteUrl, slug: post.slug }}]
            } else {
                return  { params: { site: post.siteUrl, slug: post.slug } }
            }
        }),
        fallback: true
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

export async function getStaticProps({params: {site, slug}}) {

    let filter = {
        url: site
    }
    let constraint = {
        siteUrl: site,
        slug: slug,
    }
    if (site.includes('.')) {
        filter = {
            customDomain: site
        }
        const correspondingUrl = await prisma.site.findUnique({
            where: {
                customDomain: site
            },
            select: {
                url: true
            }
        })
        constraint = {
            siteUrl: correspondingUrl?.url,
            slug: slug,
        }
    }
    
    const siteData = await prisma.site.findUnique({
        where: filter,
        select: {
            name: true,
            description: true,
            logo: true,
            url: true
        }
    })
    const post = await prisma.post.findUnique({
        where: {
            slug_site_constraint: constraint
        }
    })
    
    if (!siteData || !post) {
        return { notFound: true, revalidate: 10 };
    }

    const matterResult = post ? matter(post?.content) : ''

    // Use remark to convert markdown into HTML string
    const processedContent = await remark()
        .use(html)
        .process(matterResult.content)

    // Convert converted html to string format
    const contentHtml = processedContent.toString()
    
    // Replace all Twitter URLs with their MDX counterparts
    const finalContentHtml = await replaceAsync(contentHtml, /<p>(https?:\/\/twitter\.com\/(?:#!\/)?(\w+)\/status(?:es)?\/(\d+)([^\?]+)(\?.*)?<\/p>)/g, getTweetMetadata)
    
    // serialize the content string into MDX
    const mdxSource = await serialize(finalContentHtml);

    return {
        props: {
            subdomain: siteData,
            site: siteData,
            post: JSON.stringify(post),
            content: mdxSource,
        },
        revalidate: 10
    }
}