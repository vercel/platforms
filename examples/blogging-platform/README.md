# Blogging Platform

A blogging platform that allows users to create blogs with a default subdomain and the option to add a custom domain (usually with a premium monthly subscription).

### Demo

For context, here's a starter kit of a blogging platform built on Vercel:

- [demo.vercel.pub](https://demo.vercel.pub)
- [platformize.co](https://platformize.co) (custom domain that maps to [demo.vercel.pub](https://demo.vercel.pub))
- [app.vercel.pub](https://app.vercel.pub) (editing backend)

All of these generated sites are powered by ISR (no SSR at all) so they load pretty much instantly + the inter-page transitions are lightning fast.

### Features

- Multitenancy (subdomains + custom domains) with Vercel Domains API
- Static generation with ISR
- Static tweets (supports image, video, gif, poll, retweets, quote retweets, etc.)
- Uploading custom images (with a Cloudinary integration)
- Empty states
- Error states (for adding custom domains + subdomains)
- Fallback states for ISR on the frontend

### Real-world examples

- [Hashnode](https://hashnode.com/)
- [Medium](https://medium.com/)

### How to Use

You can choose from one of the following two methods to use this repository:

**One-Click Deploy**

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=next-example):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/vercel-customer-feedback/platforms/tree/main/examples/blogging-platform&project-name=blogging-platform&repository-name=blogging-platform)

**Clone and Deploy**

Download this repository via git:

```bash
git clone https://github.com/vercel-customer-feedback/platforms.git
```

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init) or [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/) to bootstrap the example:

```bash
npx create-next-app --example edge-middleware/examples/blogging-platform blogging-platform
# or
yarn create next-app --example edge-middleware/examples/blogging-platform blogging-platform
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=edge-middleware-eap) ([Documentation](https://nextjs.org/docs/deployment)).

> 💡 Don't forget to create an `.env` file based on the `.env.example` file that is provided and fill in all the values with the ones you want to use.
