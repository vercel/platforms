import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import fs from "fs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //   // write to a file
  //   const sites = await prisma.site.findMany();
  //   fs.writeFileSync("sites.json", JSON.stringify(sites));

  // read from file
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

  res.status(200).json({ response: "ok" });
}
