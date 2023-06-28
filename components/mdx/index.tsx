"use client";

import { MDXRemote, MDXRemoteProps } from "next-mdx-remote";
import Examples from "@/components/mdx/Examples";
import { Tweet } from "react-tweet";
import BlurImage from "@/components/BlurImage";
import { replaceLinks } from "@/lib/remark-plugins";

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
      <MDXRemote {...source} components={components} />
    </article>
  );
}
