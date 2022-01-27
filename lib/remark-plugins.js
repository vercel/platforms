import visit from "unist-util-visit";
import { getTweets } from "@/lib/twitter";
import prisma from "./prisma";

export function replaceLinks() {
  return function transformer(tree, file) {
    visit(tree, "link", replaceExternalandInternalLinks);

    function replaceExternalandInternalLinks(node) {
      node.type = "html";
      node.value = node.url.startsWith("http")
        ? `<a href="${node.url}" target="_blank">${node.children
            .map((child) => child.value)
            .join(" ")} ↗</a>`
        : `<Link href="${
            node.url
          }"><a className="cursor-pointer">${node.children
            .map((child) => child.value)
            .join(" ")}</a></Link>`;
    }
  };
}

export function replaceTweets() {
  return (tree) =>
    new Promise(async (resolve, reject) => {
      const nodesToChange = [];
      visit(tree, "text", (node) => {
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

async function getTweet(node) {
  const regex = /\/status\/(\d+)/gm;
  const id = regex.exec(node.value)[1];
  const tweetData = await getTweets(id);
  node.value =
    "<Tweet id='" + id + "' metadata={`" + JSON.stringify(tweetData) + "`}/>";
  return node.value;
}

export function replaceExamples() {
  return (tree) =>
    new Promise(async (resolve, reject) => {
      const nodesToChange = [];
      visit(tree, "mdxJsxFlowElement", (node) => {
        if (node.name == "Examples") {
          nodesToChange.push({
            node,
          });
        }
      });
      for (const { node } of nodesToChange) {
        try {
          node.type = "html";
          const mdx = await getExamples(node);
          node.value = mdx;
        } catch (e) {
          console.log("ERROR", e);
          return reject(e);
        }
      }

      resolve();
    });
}

const getExamples = async (node) => {
  const names = node.attributes[0].value.split(",");
  let data = [];
  for (let i = 0; i < names.length; i++) {
    const results = await prisma.example.findUnique({
      where: {
        id: parseInt(names[i]),
      },
    });
    data.push(results);
  }
  return `<Examples data={${JSON.stringify(data)}} />`;
};
