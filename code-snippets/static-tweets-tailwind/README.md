# Static Tweets (Tailwind)

This code snippet shows you how you can generate static tweets using Tailwind CSS & `getStaticProps` in Next.js.

## Dependencies

- Tailwind CSS (`npm install tailwindcss`)
- Tailwind Typography (`npm i @tailwindcss/typography`)
- MDX Remote (for MDX support) (`npm i next-mdx-remote`)
- Date FNS (`npm i date-fns`)
- Query String (`npm i querystring`)

## Gotchas

- Don't forget to add pbs.twimg.com to your allowed `images` in your `next.config.js` file.
- Don't forget to add Twitter Auth Bearer Token to your `.env` file.

## Demo

https://static-tweets-tailwind.vercel.app/

## How to Use

You can choose from one of the following two methods to use this repository:

**One-Click Deploy**

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=platforms-eap):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/vercel-customer-feedback/platforms/tree/main/code-snippets/static-tweets-tailwind&project-name=static-tweets-tailwind&repository-name=static-tweets-tailwind)

**Clone and Deploy**

Download this repository via git:

```bash
git clone https://github.com/vercel-customer-feedback/platforms.git
```

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init) or [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/) to bootstrap the example:

```bash
npx create-next-app --example platforms/code-snippets/static-tweets-tailwind static-tweets-tailwind
# or
yarn create next-app --example platforms/code-snippets/static-tweets-tailwind static-tweets-tailwind
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=platforms-eap) ([Documentation](https://nextjs.org/docs/deployment)).
