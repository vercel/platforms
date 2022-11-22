"use client";
import { MDXRemote } from "next-mdx-remote";
import type { MDXRemoteSerializeResult } from "next-mdx-remote";
import BlurImage from "@/components/BlurImage";
import Examples from "@/components/mdx/Examples";
import Tweet from "@/components/mdx/Tweet";
import { replaceLinks } from "@/lib/remark-plugins";

const components = {
  a: replaceLinks,
  BlurImage,
  Examples,
  Tweet,
};

export default function Article({
  mdxSourceSerialized,
}: {
  mdxSourceSerialized: string;
}) {
  const mdxSource = JSON.parse(mdxSourceSerialized) as MDXRemoteSerializeResult<
    Record<string, unknown>
  >;
  return (
    <article className="w-11/12 sm:w-3/4 m-auto prose prose-md sm:prose-lg">
      <MDXRemote {...mdxSource} components={components} />
    </article>
  );
}
