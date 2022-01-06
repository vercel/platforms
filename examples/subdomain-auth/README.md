# Simple Example

A dead-simple barebones implementation of Platforms on Vercel.

The example below is generated based on the following mock database:

```
const mockDB = [
    {name: "Site 1", description: "Subdomain + custom domain", subdomain: "subdomain-1", customDomain: "custom-domain-1.com"},
    {name: "Site 2", description: "Subdomain only", subdomain: "subdomain-2", customDomain: null},
    {name: "Site 3", description: "Subdomain only", subdomain: "subdomain-3", customDomain: null},
]
```

When deploying your own clone of this example, you will need to replace the data fetching methods in `getStaticPaths` and `getStaticProps` with your own database of choice (BYOD, _Bring-Your-Own-Database_).

### Demo

- [subdomain-1.vercel.sh](https://subdomain-1.vercel.sh/) (subdomain)
- [subdomain-2.vercel.sh](https://subdomain-2.vercel.sh/) (subdomain)
- [subdomain-3.vercel.sh](https://subdomain-3.vercel.sh/) (subdomain)
- [custom-domain-1.com](https://custom-domain-1.com/) (custom domain, maps to [subdomain-1.vercel.sh](https://subdomain-1.vercel.sh/))

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
