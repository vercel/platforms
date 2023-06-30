<p align="center">
  <a href="https://demo.vercel.pub">
    <img src="https://assets.vercel.com/image/upload/v1588805858/repositories/vercel/logo.png" height="96">
    <h3 align="center">Platforms Starter Kit</h3>
  </a>
</p>

<p align="center">
  The <em>all-in-one</em> starter kit <br/>
  for building multi-tenant applications.
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

Deploy your own version of this starter kit with Vercel.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?demo-title=Platforms+Starter+Kit&demo-description=A+template+for+site+builders+and+low-code+tools.&demo-url=https%3A%2F%2Fdemo.vercel.pub%2F&demo-image=%2F%2Fimages.ctfassets.net%2Fe5382hct74si%2F40JwjdHlPr0Z575MPYbxUA%2Fd5903afc68cb34569a3886293414c37c%2FOG_Image.png&project-name=Platforms+Starter+Kit&repository-name=platforms-starter-kit&repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fplatforms&from=templates&env=NEXT_PUBLIC_ROOT_DOMAIN%2CNEXTAUTH_SECRET%2CAUTH_GITHUB_ID%2CAUTH_GITHUB_SECRET%2CAUTH_BEARER_TOKEN%2CPROJECT_ID_VERCEL%2CTEAM_ID_VERCEL%2COPENAI_API_KEY&envDescription=These+environment+variables+are+required+to+run+this+application.&envLink=https%3A%2F%2Fgithub.com%2Fvercel%2Fplatforms%2Fblob%2Fmain%2F.env.example&stores=[{"type":"postgres"},{"type":"blob"}])

You can also [read the guide](https://vercel.com/guides/nextjs-multi-tenant-application) to learn how to develop your own version of this template.

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
- **AI-powered content creation**: AI powered WYSIWYG editor for a Notion-style writing experience with [Novel](https://novel.sh/) and OpenAI
- **Personalized content**: With the App Router and Layouts, you can allow customers to set custom fonts, 404 pages, and favicon for their sites.
- **Uploading custom images**: Allow your customers to upload custom thumbnail images with [Vercel Blob](https://vercel.com/docs/storage/vercel-blob).
- **Static tweets**: Avoid [Cumulative Layout Shift](https://vercel.com/blog/core-web-vitals) (CLS) from the native Twitter embed by using our [static tweets implementation](https://github.com/vercel-labs/react-tweet) (supports image, video, gif, poll, retweets, quote retweets, and more).

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

With Vercel and Next.js, platforms like [Instatus](https://instatus.com) are able to create status pages that are _10x faster_ than competitors.

1. [Instatus](https://instatus.com/)
2. [Cal.com](https://cal.com/)
3. [Dub](https://dub.sh/)

## Built on open source

This working demo site was built using the Platforms Starter Kit and:

- [Next.js](https://nextjs.org/) as the React framework
- [Tailwind](https://tailwindcss.com/) for CSS styling
- [Prisma](https://prisma.io/) as the ORM for database access
- [Novel](https://novel.sh/) for the WYSIWYG editor
- [Vercel Postgres](https://vercel.com/storage/postgres) for the database
- [Vercel Blob](https://vercel.com/storage-blob) for image uploads
- [NextAuth.js](https://next-auth.js.org/) for authentication
- [Vercel](http://vercel.com/) for deployment

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
