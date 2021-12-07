<p align="center">
  <a href="https://vercel.com/platforms">
    <img src="https://assets.vercel.com/image/upload/v1588805858/repositories/vercel/logo.png" height="96">
    <h3 align="center">Platforms on Vercel</h3>
  </a>
</p>

<p align="center">
  The <em>all-in-one</em> starter kit <br/>
  for building platforms on Vercel.
</p>

<p align="center">
  <a href="#introduction"><strong>Introduction</strong></a> ·
  <a href="#examples"><strong>Examples</strong></a> ·
  <a href="#code-snippets"><strong>Code Snippets</strong></a> ·
  <a href="#contributing"><strong>Contributing</strong></a>
</p>
<br/>

## Introduction

_**Welcome to the Platforms on Vercel Early Access Program!**_

Platforms on Vercel are Vercel customers that allow their users to create unique content pages with a multi-tenant infrastructure. Each user gets assigned a unique subdomain when they create their account, with the (usually paid) option to add a custom domain.

For instance, each writer on Substack has their own unique `.substack.com` subdomain for their newsletters:

- [pomp.substack.com](http://pomp.substack.com/)
- [platformer.substack.com](http://platformer.substack.com/)
- [astralcodexten.substack.com](http://astralcodexten.substack.com/)

Users can also map their custom domains to their `.substack.com` subdomain for an extra fee:

- [platformer.news](http://platformer.news) → [platformer.substack.com](http://platformer.substack.com/)

At Vercel, we want to provide these platforms with a comprehensive solutions for them to build platforms like Substack super easily.

## Examples

Multi-tenancy app infrastructures work really well with the following types of apps:

### 1. Content creation platforms

Content-heavy platforms (blogs) that have a simple, standardized page layouts/route structure. Some examples include:

- Substack
- Medium ([forge.medium.com](http://forge.medium.com/), [marker.medium.com](https://marker.medium.com/))

### 2. Website/E-commerce Store Builders

Site builders that require complex routing, freeform pages. Some examples include:

- Webflow
- [Super.so](http://super.so) ([tr.af](https://tr.af) → [traf.super.site](https://traf.super.site))

### 3. B2B2C platforms

White-labeled SaaS applications that require multi-tenant authentication/login, role-based access controls (RBAC), etc. Some examples include:

- Instatus ([sketch.instatus.com](http://sketch.instatus.com/), [linear.instatus.com](http://linear.instatus.com/))
- Canny ([framer.canny.io](https://framer.canny.io/), [ahrefs.canny.io](http://ahrefs.canny.io/))

## Code Snippets

Here are some supplementary code snippets that might be required to build Platforms on Vercel:

- Text Editor
- Simple Auth
- [Static Tweet Embeds](./code-snippets/static-tweets-tailwind)
- OG-image generator

Check out the full list of features [here](./code-snippets).

## Contributing

- [Start a Discussion](https://github.com/vercel-customer-feedback/platforms/discussions) with a question, piece of feedback, or idea you want to share with the team.
- [Open an Issue](https://github.com/vercel-customer-feedback/platforms/issues) if you believe you've encountered a bug that you want to flag for the team.
