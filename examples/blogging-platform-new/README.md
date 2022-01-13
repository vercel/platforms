<p align="center">
  <a href="https://daocentral.com">
    <img src="https://user-images.githubusercontent.com/28986134/147528932-796825b5-1742-47bd-982c-39bf9d3eb814.png" height="96">
    <h3 align="center">DAO Central</h3>
  </a>
</p>

<p align="center">
  Discover the latest DAOs, learn about their mission & values,
  and join the ones that you love.
</p>

<p align="center">
  <a href="#introduction"><strong>Introduction</strong></a> ·
  <a href="#stack"><strong>Stack</strong></a> ·
  <a href="#installation"><strong>Installation</strong></a> ·
  <a href="#contributing"><strong>Contributing</strong></a>
</p>
<br/>

## Introduction

Welcome to the DAO Central repo.

## Stack

- Next.js (React framework)
- Tailwind (CSS)
- Prisma (ORM)
- Next Auth (Auth)
- Planetscale (DB)

## Installation

Below are the steps to get this repo up and running in localhost: 

> Prerequisite: You need to have the [Prisma](https://www.prisma.io/docs/concepts/components/prisma-cli/installatio) and [PlanetScale](https://docs.planetscale.com/reference/planetscale-environment-setup) CLIs installed

1. Clone this repo. Once it's cloned, `cd` into the folder and run:
```
npm i
```
2. In PlanetScale, create a `daocentral` database
3. In your database's Settings page, check "Automatically copy migration data" and select "Prisma"
4. Create an `staging` and `shadow` database branches from `main` branch
5. Edit the `.env` file: 
```
DATABASE_URL="mysql://root@127.0.0.1:3309/daocentral"
SHADOW_DATABASE_URL="mysql://root@127.0.0.1:3310/daocentral"
```
6. Next, we will use `pscale` CLI to locally proxy into our PlanetScale database. In a two different terminal tabs, run:
```
pscale connect daocentral staging --port 3309
```
```
pscale connect daocentral shadow --port 3310
```
7. In a different terminal, run the following to create the initial data model and do your first Prisma migrate by running the following code. You will notice a `prisma/migrations` folder as well as the schema in your `staging` branch in PlanetScale.
```
prisma migrate dev --name init
```

8. Add data using `npx prisma studio`, which will open a browser window. Seed the database with random data – for `imageUrl` and `imageBlurhash`, you can use the following values
```
imageUrl: http://res.cloudinary.com/daojones/image/upload/v1637806256/zjnygtqzl09ifsn7n8qy.jpg
imageBlurhash: data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQYV2PYsGHDfwAHNAMQumvbogAAAABJRU5ErkJggg==

imageUrl: http://res.cloudinary.com/daojones/image/upload/v1637743458/zck20kzjidjswosrzo3f.jpg
imageBlurhash: data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQYV2PYsGHDfwAHNAMQumvbogAAAABJRU5ErkJggg==
```
 
10. Create a `.env` file and populate it with the following values:
```
ALCHEMY_API_KEY=fo_hhNev105aZb5N9wmxoLk1jv0WB4EC
JWT_TOKEN_KEY=c17c860e-82e9-441d-bf29-122d7dd47dc6
```

11. Run: 
```npm run dev```
Navigate to http://localhost:3000/. You can now try to connect a wallet by clicking on Sign In and connect your Metamask wallet. You'll be asked to sign a message, which will persist your session locally via a JWT token (`daocentral_auth_token`)

12. Set up Prettier to make sure all our commits have the same formats. Prettier is already included in `package.json` so all you need to do is make sure "Format on Save" is enabled on VS Code. Here's a [Stackoverflow thread](https://stackoverflow.com/questions/52586965/why-does-prettier-not-format-code-in-vs-code) that might be helpful.
