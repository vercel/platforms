/* 
    This was the migration script we used to migrate from
    our old database to the new Vercel Postgres database.
    It's not needed anymore, but I'm keeping it here for
    posterity.
*/

import { NextResponse } from "next/server";
// import prisma from "@/lib/prisma";

export async function GET() {
  //   Download data from old database
  //  const users = await prisma.user.findMany();
  //  const accounts = await prisma.account.findMany();
  //  const sites = await prisma.site.findMany();
  //  const posts = await prisma.post.findMany();
  //  const examples = await prisma.example.findMany();

  //  fs.writeFileSync("users.json", JSON.stringify(users));
  //  fs.writeFileSync("accounts.json", JSON.stringify(accounts));
  //   fs.writeFileSync("sites.json", JSON.stringify(sites));
  //   fs.writeFileSync("posts.json", JSON.stringify(posts));
  //   fs.writeFileSync("examples.json", JSON.stringify(examples));

  // Upload data to new database
  //   const users = JSON.parse(fs.readFileSync("users.json", "utf8"));
  //   const accounts = JSON.parse(fs.readFileSync("accounts.json", "utf8"));
  //   const sites = JSON.parse(fs.readFileSync("sites.json", "utf8"));
  //   const posts = JSON.parse(fs.readFileSync("posts.json", "utf8"));
  //   const examples = JSON.parse(fs.readFileSync("examples.json", "utf8"));

  //   const response = await Promise.all([
  //     prisma.user.createMany({
  //       data: users,
  //       skipDuplicates: true,
  //     }),
  //     prisma.account.createMany({
  //       data: accounts,
  //       skipDuplicates: true,
  //     }),
  //     prisma.site.createMany({
  //       data: sites,
  //       skipDuplicates: true,
  //     }),
  //     prisma.post.createMany({
  //       data: posts,
  //       skipDuplicates: true,
  //     }),
  //   prisma.example.createMany({
  //     data: examples,
  //     skipDuplicates: true,
  //   })

  return NextResponse.json({ response: "ok" });
}
