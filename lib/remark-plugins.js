import visit from "unist-util-visit";
import { getTweets } from "@/lib/twitter";
import Link from "next/link";

export function replaceLinks({ children, href }) {
  // this is technically not a remark plugin but it
  // replaces internal links with <Link /> component
  // and external links with <a target="_blank" />
  return href.startsWith("/") || href === "" ? (
    <Link href={href}>
      <a className="cursor-pointer">{children}</a>
    </Link>
  ) : (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children} ↗
    </a>
  );
}

export function replaceTweets() {
  return (tree) =>
    new Promise(async (resolve, reject) => {
      //console.log(JSON.stringify(tree, null, 4));
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

export function replaceExamples(prisma) {
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

const getExamples = async (node, prisma) => {
  const names = node?.attributes[0].value.split(",");
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
