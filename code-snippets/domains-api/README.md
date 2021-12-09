# Static Tweets (Tailwind)

This code snippet shows you how you can leverage Vercel's Domains API to add and remove domains programmatically from your Platforms on Vercel project.

## Dependencies

- Tailwind CSS (`npm install tailwindcss`)
- SWR (`npm install swr`)
- React Hot Toast (`npm install react-hot-toast`) (optional)
- JS Cookie (`npm install js-cookie`) (optional)

## Features

### 1. Adding Domains

To add a domain, you can use the `/v8/projects/{idOrName}/domains` endpoint as shown [here](./pages/api/add-domain) ([full documentation](https://vercel.com/docs/rest-api#endpoints/projects/add-a-domain-to-a-project)).

When a domain is added, there are 3 possible outcomes:
a. Domain is added successfully (response code `200`).
b. Domains is already in use by another project and can't be added (response code `409`).
c. Domains belongs to a different team but you can potentially request delegation for the domain (response code `403`).

> Request delegation for domains can be done with the `/v6/domains/{domain}/request-delegation` endpoint as shown [here](./pages/api/request-delegation) ([full documentation](https://vercel.notion.site/Preview-Requesting-Subdomain-Access-79df63d854b24a0abd52da991d50cb81)).

### 2. Auto-checking Domain Configuration

When a domain is first added to a project, we use [SWR](https://swr.vercel.app) to periodically check if the domain's DNS records are configured correctly. This is done using the `/v6/domains/{domain}/config` endpoint as shown [here](./pages/api/check-domain).

There are two ways that your users can configure their domains after they are added:

- CNAME record:
  - recommended for subdomains (blog.domain.com, app.domain.com)
  - you can set up a branded CNAME value by adding an `A` record for the `cname` subdomain on your domain and point it to to Vercel's IP address `76.76.21.21`
- A record:
  - recommended for apex domains (domain.com)

Example:

### 3. Removing Domains

## Demo

https://domains-api.vercel.app/

## How to Use

You can choose from one of the following two methods to use this repository:

**One-Click Deploy**

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=platforms-eap):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/vercel-customer-feedback/platforms/tree/main/code-snippets/domains-api&project-name=domains-api&repository-name=domains-api)

**Clone and Deploy**

Download this repository via git:

```bash
git clone https://github.com/vercel-customer-feedback/platforms.git
```

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init) or [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/) to bootstrap the example:

```bash
npx create-next-app --example platforms/code-snippets/domains-api domains-api
# or
yarn create next-app --example platforms/code-snippets/domains-api domains-api
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=platforms-eap) ([Documentation](https://nextjs.org/docs/deployment)).
