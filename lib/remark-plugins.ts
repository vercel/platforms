import visit from "unist-util-visit";

import prisma from "./prisma";
import { getTweets } from "@/lib/twitter";

import type { Literal, Node } from "unist";
import type { Example } from "@prisma/client";

interface NodesToChange {
  node: Literal<string>;
}

export function replaceLinks() {
  return function transforme<T extends Node>(tree: T) {
    visit(tree, "link", (node: any) => {
      node.type = "html";
      node.value = node.url.startsWith("http")
        ? `<a href="${node.url}" target="_blank">${node.children
            .map((child: any) => child.value)
            .join(" ")} ↗</a>`
        : `<Link href="${
            node.url
          }"><a className="cursor-pointer">${node.children
            .map((child: any) => child.value)
            .join(" ")}</a></Link>`;
    });
  };
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
        )
          nodesToChange.push({
            node,
          });
      });

      for (const { node } of nodesToChange) {
        try {
          node.type = "html";
          const mdx = await getTweet(node);
          node.value = mdx;
        } catch (e) {
          console.error(e);
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

export function replaceExamples<T extends Node>() {
  return (tree: T) =>
    new Promise<void>(async (resolve, reject) => {
      const nodesToChange = new Array<NodesToChange>();

      visit(tree, "mdxJsxFlowElement", (node: any) => {
        if (!node.data)
          throw new Error(
            "Failed to replace examples as no node data was found"
          );

        if (node.data.name == "Examples")
          nodesToChange.push({
            node,
          });
      });

      for (const { node } of nodesToChange) {
        try {
          node.type = "html";
          const mdx = await getExamples(node);
          node.value = mdx;
        } catch (e) {
          console.error(e);
          return reject(e);
        }
      }

      resolve();
    });
}

async function getExamples(node: any) {
  const names = node.attributes[0].value.split(",");

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
