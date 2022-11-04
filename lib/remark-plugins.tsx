import Link from "next/link";
import { visit } from "unist-util-visit";

import { getTweets } from "@/lib/twitter";

import type { Literal, Node } from "unist";
import type { Example, PrismaClient } from "@prisma/client";

import type { WithChildren } from "@/types";

interface NodesToChange {
  node: Literal<string>;
}

export function replaceLinks(options: { href: string } & WithChildren) {
  // this is technically not a remark plugin but it
  // replaces internal links with <Link /> component
  // and external links with <a target="_blank" />
  return options.href.startsWith("/") || options.href === "" ? (
    <Link href={options.href} className="cursor-pointer">
      {options.children}
    </Link>
  ) : (
    <a href={options.href} target="_blank" rel="noopener noreferrer">
      {options.children} ↗
    </a>
  );
}

export function replaceTweets<T extends Node>() {
  return (tree: T) =>
    new Promise<void>(async (resolve, reject) => {
      const nodesToChange = new Array<NodesToChange>();

      visit(tree, "text", (node: any) => {
        if (
          node.value.match(
            /https?:\/\/twitter\.com\/(?:#!\/)?(\w+)\/status(?:es)?\/(\d+)([^\?])(\?.*)?/g
          )
        ) {
          nodesToChange.push({
            node,
          });
        }
      });
      for (const { node } of nodesToChange) {
        try {
          node.type = "html";
          const mdx = await getTweet(node);
          node.value = mdx;
        } catch (e) {
          console.log("ERROR", e);
          return reject(e);
        }
      }

      resolve();
    });
}

async function getTweet(node: Literal<string>) {
  const regex = /\/status\/(\d+)/gm;

  const matches = regex.exec(node.value);
  if (!matches) throw new Error(`Failed to get tweet: ${node}`);

  const id = matches[1];

  const tweetData = await getTweets(id);

  node.value =
    "<Tweet id='" + id + "' metadata={`" + JSON.stringify(tweetData) + "`}/>";

  return node.value;
}

export function replaceExamples<T extends Node>(prisma: PrismaClient) {
  return (tree: T) =>
    new Promise<void>(async (resolve, reject) => {
      const nodesToChange = new Array<NodesToChange>();

      visit(tree, "mdxJsxFlowElement", (node: any) => {
        if (node.name == "Examples") {
          nodesToChange.push({
            node,
          });
        }
      });
      for (const { node } of nodesToChange) {
        try {
          node.type = "html";
          const mdx = await getExamples(node, prisma);
          node.value = mdx;
        } catch (e) {
          console.log("ERROR", e);
          return reject(e);
        }
      }

      resolve();
    });
}

async function getExamples(node: any, prisma: PrismaClient) {
  const names = node?.attributes[0].value.split(",");

  const data = new Array<Example | null>();

  for (let i = 0; i < names.length; i++) {
    const results = await prisma.example.findUnique({
      where: {
        id: parseInt(names[i]),
      },
    });
    data.push(results);
  }

  return `<Examples data={${JSON.stringify(data)}} />`;
}
