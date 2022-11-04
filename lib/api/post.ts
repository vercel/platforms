import prisma from "@/lib/prisma";

import type { NextApiRequest, NextApiResponse } from "next";
import type { Post, Site } from ".prisma/client";
import type { Session } from "next-auth";
import { revalidate } from "@/lib/revalidate";
import { getBlurDataURL, placeholderBlurhash } from "@/lib/util";

import type { WithSitePost } from "@/types";

interface AllPosts {
  posts: Array<Post>;
  site: Site | null;
}

/**
 * Get Post
 *
 * Fetches & returns either a single or all posts available depending on
 * whether a `postId` query parameter is provided. If not all posts are
 * returned in descending order.
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 */
export async function getPost(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
): Promise<void | NextApiResponse<AllPosts | (WithSitePost | null)>> {
  const { postId, siteId, published } = req.query;

  if (
    Array.isArray(postId) ||
    Array.isArray(siteId) ||
    Array.isArray(published)
  )
    return res.status(400).end("Bad request. Query parameters are not valid.");

  if (!session.user.id)
    return res.status(500).end("Server failed to get session user ID");

  try {
    if (postId) {
      const post = await prisma.post.findFirst({
        where: {
          id: postId,
          site: {
            user: {
              id: session.user.id,
            },
          },
        },
        include: {
          site: true,
        },
      });

      return res.status(200).json(post);
    }

    const site = await prisma.site.findFirst({
      where: {
        id: siteId,
        user: {
          id: session.user.id,
        },
      },
    });

    const posts = !site
      ? []
      : await prisma.post.findMany({
          where: {
            site: {
              id: siteId,
            },
            published: JSON.parse(published || "true"),
          },
          orderBy: {
            createdAt: "desc",
          },
        });

    return res.status(200).json({
      posts,
      site,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}

/**
 * Create Post
 *
 * Creates a new post from a provided `siteId` query parameter.
 *
 * Once created, the sites new `postId` will be returned.
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 */
export async function createPost(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void | NextApiResponse<{
  postId: string;
}>> {
  const { siteId } = req.query;

  if (Array.isArray(siteId))
    return res
      .status(400)
      .end("Bad request. siteId parameter cannot be an array.");

  try {
    const response = await prisma.post.create({
      data: {
        image: `/placeholder.png`,
        imageBlurhash: placeholderBlurhash,
        site: {
          connect: {
            id: siteId,
          },
        },
      },
    });

    return res.status(201).json({
      postId: response.id,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}

/**
 * Delete Post
 *
 * Deletes a post from the database using a provided `postId` query
 * parameter.
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 */
export async function deletePost(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void | NextApiResponse> {
  const { postId } = req.query;

  if (Array.isArray(postId))
    return res
      .status(400)
      .end("Bad request. postId parameter cannot be an array.");

  try {
    const response = await prisma.post.delete({
      where: {
        id: postId,
      },
      include: {
        site: {
          select: { subdomain: true, customDomain: true },
        },
      },
    });
    if (response?.site?.subdomain) {
      // revalidate for subdomain
      await revalidate(
        `https://${response.site?.subdomain}.vercel.pub`, // hostname to be revalidated
        response.site.subdomain, // siteId
        response.slug // slugname for the post
      );
    }
    if (response?.site?.customDomain)
      // revalidate for custom domain
      await revalidate(
        `https://${response.site.customDomain}`, // hostname to be revalidated
        response.site.customDomain, // siteId
        response.slug // slugname for the post
      );

    return res.status(200).end();
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}

/**
 * Update Post
 *
 * Updates a post & all of its data using a collection of provided
 * query parameters. These include the following:
 *  - id
 *  - title
 *  - description
 *  - content
 *  - slug
 *  - image
 *  - imageBlurhash
 *  - published
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 */
export async function updatePost(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void | NextApiResponse<Post>> {
  const {
    id,
    title,
    description,
    content,
    slug,
    image,
    published,
    subdomain,
    customDomain,
  } = req.body;

  try {
    const post = await prisma.post.update({
      where: {
        id: id,
      },
      data: {
        title,
        description,
        content,
        slug,
        image,
        imageBlurhash: await getBlurDataURL(image),
        published,
      },
    });
    if (subdomain) {
      // revalidate for subdomain
      await revalidate(
        `https://${subdomain}.vercel.pub`, // hostname to be revalidated
        subdomain, // siteId
        slug // slugname for the post
      );
    }
    if (customDomain)
      // revalidate for custom domain
      await revalidate(
        `https://${customDomain}`, // hostname to be revalidated
        customDomain, // siteId
        slug // slugname for the post
      );

    return res.status(200).json(post);
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}
