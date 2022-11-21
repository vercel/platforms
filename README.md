<p align="center">
  <a href="https://demo.vercel.pub">
    <img src="https://assets.vercel.com/image/upload/v1588805858/repositories/vercel/logo.png" height="96">
    <h3 align="center">Platforms Starter Kit</h3>
  </a>
</p>

<p align="center">
  The <em>all-in-one</em> starter kit <br/>
  for building platforms on Vercel.
</p>

<p align="center">
  <a href="#introduction"><strong>Introduction</strong></a> ·
  <a href="https://vercel.com/guides/nextjs-multi-tenant-application"><strong>Guide</strong></a> ·
  <a href="https://demo.vercel.pub/"><strong>Demo</strong></a> ·
  <a href="https://steven.vercel.pub/kitchen-sink"><strong>Kitchen Sink</strong></a> ·
  <a href="#contributing"><strong>Contributing</strong></a>
</p>
<br/>

## Deploy Your Own

[Read the guide](https://vercel.com/guides/nextjs-multi-tenant-application) to learn how to deploy your own version of this template.

## Introduction

Multi-tenant applications serve multiple customers across different subdomains/custom domains with a single unified codebase. 

For example, our demo is a multi-tenant application:

- Subdomain: [demo.vercel.pub](http://demo.vercel.pub)
- Custom domain: [platformize.co](http://platformize.co) (maps to [demo.vercel.pub](http://demo.vercel.pub))
- Build your own: [app.vercel.pub](http://app.vercel.pub)

Another example is [Hashnode](https://vercel.com/customers/hashnode), a popular blogging platform. Each writer has their own unique `.hashnode.dev` subdomain for their blog:

- [eda.hashnode.dev](https://eda.hashnode.dev/)
- [katycodesstuff.hashnode.dev](https://katycodesstuff.hashnode.dev/)
- [akoskm.hashnode.dev](https://akoskm.hashnode.dev/)

Users can also map custom domains to their `.hashnode.dev` subdomain:

- [akoskm.com](https://akoskm.com/) → [akoskm.hashnode.dev](https://akoskm.hashnode.dev/)

This repository makes it easier than ever for creators to build their own platform.

## Template features

Forget manually setting up CNAME records, wrestling with DNS, or making custom server rewrite rules with NGINX. With Vercel and the Platforms Starter Kit, you can focus on building the next big thing.

- **Custom domains**: Subdomain and custom domains support with [Edge Functions](https://vercel.com/features/edge-functions) and the [Vercel Domains API](https://domains-api.vercel.app/).
- **Static generation with ISR**: Performance without sacrificing personalization, by combining [Incremental Static Regeneration](https://vercel.com/docs/concepts/next.js/incremental-static-regeneration) (ISR) and [Middleware](https://vercel.com/docs/concepts/functions/edge-functions#middleware). ISR allows you to create new content (with custom domains) on demand without needing to redeploy your application.
- **Uploading custom images**: Allow your customers to upload custom thumbnail images with our Cloudinary integration.
- **Static tweets**: Avoid [Cumulative Layout Shift](https://vercel.com/blog/core-web-vitals) (CLS) from the native Twitter embed by using our [static tweets implementation](https://static-tweets-tailwind.vercel.app/) (supports image, video, gif, poll, retweets, quote retweets, and more).

## Examples of platforms

Vercel customers like [Hashnode](https://vercel.com/customers/hashnode), [Super](https://super.so), and [Cal.com](https://cal.com) are building scalable platforms on top of Vercel and Next.js. There are multiple types of platforms you can build with this starter kit:

### 1. Content creation platforms

These are content-heavy platforms (blogs) with simple, standardized page layouts and route structure. 

> “With Vercel, we spend less time managing our infrastructure and more time delivering value to our users.” — Sandeep Panda, Co-founder, Hashnode

1. [Hashnode](https://hashnode.com)
2. [Mirror.xyz](https://mirror.xyz/)
3. [Read.cv](https://read.cv/)

### 2. Website & e-commerce store builders

No-code site builders with customizable pages. 

By using Next.js and Vercel, [Super](https://super.so/) has fast, globally distributed websites with a no-code editor (Notion). Their customers get all the benefits of Next.js (like [Image Optimization](https://nextjs.org/docs/basic-features/image-optimization)) without touching any code.

1. [Super.so](https://super.so)
2. [Typedream](https://typedream.com)
3. [Makeswift](https://www.makeswift.com/)

### 3. B2B2C platforms

Multi-tenant authentication, login, and access controls.

With Vercel and Next.js, platforms like [Instatus](https://instatus.com) are able to create status pages that are *10x faster* than competitors.

1. [Instatus](https://instatus.com/)
2. [Cal.com](https://cal.com/)
3. [Dub](https://dub.sh/)

## Built on open source

This working demo site was built using the Platforms Starter Kit and:

- [Next.js](https://nextjs.org/) as the React framework
- [Tailwind](https://tailwindcss.com/) for CSS styling
- [Prisma](https://prisma.io/) as the ORM for database access
- [PlanetScale](https://planetscale.com/) as the database (MySQL)
- [NextAuth.js](https://next-auth.js.org/) for authentication
- [Vercel](http://vercel.com/) for deployment

We also have another [example](https://github.com/vercel/examples/tree/main/solutions/platforms-slate-supabase) of the Platforms Starter Kit that uses Supabase for the database and Slate.js for the text editor.

## Frequently Asked Questions

- **Should we be generating static webpages with `getStaticProps` and `getStaticPaths` at build time? It doesn't seem to be very scalable.**

  For scale, we recommend using [Incremental Static Regeneration](https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration) instead. This basically means that instead of generating all pages at build time, you only specify a subset of pages and then generate the rest on the fly. Then when someone requests that page, all subsequent requests will be cached on the Vercel edge. You can also use [on-demand ISR](https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration#on-demand-revalidation) to programmatically invalidate caches per page every time someone makes a change to it, which is what we do [here](https://github.com/vercel/platforms/blob/1b2bd00055bbbdde8f2dcc89e0bdb2c3f8488f97/lib/api/post.ts#L243-L257).

- **Is it wise to be using the `/_sites/[site]` path to serve all static pages/website? Wouldn't that lead to a significant amount of load on a single Next.js server?**

  The beauty about a serverless setup is you won’t have to worry about load since each request invokes a separate serverless function, and once it’s cached, you don’t invoke the server anymore (the page is served directly from the Vercel edge). Read more about the [Vercel Edge Network](https://vercel.com/docs/concepts/edge-network/overview) and [how caching works](https://vercel.com/docs/concepts/edge-network/caching).


## Contributing

- [Start a discussion](https://github.com/vercel/platforms/discussions) with a question, piece of feedback, or idea you want to share with the team.
- [Open an issue](https://github.com/vercel/platforms/issues) if you believe you've encountered a bug with the starter kit.

## Author

- Steven Tey ([@steventey](https://twitter.com/steventey))

## License

The MIT License.

---

<a aria-label="Vercel logo" href="https://vercel.com">
  <img src="https://badgen.net/badge/icon/Made%20by%20Vercel?icon=zeit&label&color=black&labelColor=black">
</a>
