# Subdomain Auth Example

- [subdomain-auth.com](http://subdomain-auth.com) (login from here)
- [sub1.subdomain-auth.com](http://sub1.subdomain-auth.com)

### Features

- 🔀 Hostname Rewrites

### How to Use

You can choose from one of the following two methods to use this repository:

**One-Click Deploy**

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=next-example):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/vercel-customer-feedback/platforms/tree/main/examples/simple-example&project-name=simple-example&repository-name=simple-example)

**Clone and Deploy**

Download this repository via git:

```bash
git clone https://github.com/vercel-customer-feedback/platforms.git
```

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init) or [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/) to bootstrap the example:

```bash
npx create-next-app --example edge-middleware/examples/simple-example simple-example
# or
yarn create next-app --example edge-middleware/examples/simple-example simple-example
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=edge-middleware-eap) ([Documentation](https://nextjs.org/docs/deployment)).

> 💡 Do note that you will need to replace the `ROOT_URL` variable in the `.env.example` file with your domain of choice and add that domain as a wildcard domain your Vercel project.
