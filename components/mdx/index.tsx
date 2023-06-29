"use client";

import { MDXRemote, MDXRemoteProps } from "next-mdx-remote";
import { replaceLinks } from "@/lib/remark-plugins";
import Examples from "./examples";
import { Tweet } from "react-tweet";
import BlurImage from "@/components/blur-image";

export default function MDX({ source }: { source: MDXRemoteProps }) {
  const components = {
    a: replaceLinks,
    BlurImage,
    Examples,
    Tweet,
  };

  return (
    <article
      className="w-11/12 sm:w-3/4 m-auto prose prose-md sm:prose-lg"
      suppressHydrationWarning={true}
    >
      {/* @ts-ignore */}
      <MDXRemote {...source} components={components} />
    </article>
  );
}
