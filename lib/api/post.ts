import prisma from "@/lib/prisma";

import type { NextApiRequest, NextApiResponse } from "next";
import type { Post, Site } from ".prisma/client";
import type { Session } from "next-auth";
import { revalidate } from "@/lib/revalidate";

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
            published: JSON.parse(published),
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
        imageBlurhash:
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAoJJREFUWEfFl4lu4zAMRO3cx/9/au6reMaOdkxTTl0grQFCRoqaT+SQotq2bV9N8rRt28xms87m83l553eZ/9vr9Wpkz+ezkT0ej+6dv1X81AFw7M4FBACPVn2c1Z3zLgDeJwHgeLFYdAARYioAEAKJEG2WAjl3gCwNYymQQ9b7/V4spmIAwO6Wy2VnAMikBWlDURBELf8CuN1uHQSrPwMAHK5WqwFELQ01AIXdAa7XawfAb3p6AOwK5+v1ugAoEq4FRSFLgavfQ49jAGQpAE5wjgGCeRrGdBArwHOPcwFcLpcGU1X0IsBuN5tNgYhaiFFwHTiAwq8I+O5xfj6fOz38K+X/fYAdb7fbAgFAjIJ6Aav3AYlQ6nfnDoDz0+lUxNiLALvf7XaDNGQ6GANQBKR85V27B4D3QQRw7hGIYlQKWGM79hSweyCUe1blXhEAogfABwHAXAcqSYkxCtHLUK3XBajSc4Dj8dilAeiSAgD2+30BAEKV4GKcAuDqB4TdYwBgPQByCgApUBoE4EJUGvxUjF3Q69/zLw3g/HA45ABKgdIQu+JPIyDnisCfAxAFNFM0EFNQ64gfS0EUoQP8ighrZSjn3oziZEQpauyKbfjbZchHUL/3AS/Dd30gAkxuRACgfO+EWQW8qwI1o+wseNuKcQiESjALvwNoMI0TcRzD4lFcPYwIM+JTF5x6HOs8yI7jeB5oKhpMRFH9UwaSCDB2Jmg4rc6E2TT0biIaG0rQhNqyhpHBcayTTSXH6vcDL7/sdqRK8LkwTsU499E8vRcAojHcZ4AxABdilgrp4lsXk8oVqgwh7+6H3phqd8J0Kk4vbx/+sZqCD/vNLya/5dT9fAH8g1WdNGgwbQAAAABJRU5ErkJggg==",
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
    if (response) {
      await revalidate(
        `https://${response.site?.subdomain}.vercel.pub`,
        response.slug
      ); // revalidate for subdomain
    }
    if (response?.site?.customDomain)
      await revalidate(`https://${response.site.customDomain}`, response.slug); // revalidate for custom domain

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
    imageBlurhash,
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
        imageBlurhash,
        published,
      },
    });
    if (subdomain) await revalidate(`https://${subdomain}.vercel.pub`, slug); // revalidate for subdomain
    if (customDomain) await revalidate(`https://${customDomain}`, slug); // revalidate for custom domain

    return res.status(200).json(post);
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}
