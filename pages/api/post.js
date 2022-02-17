import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { revalidate } from "@/lib/revalidate";

export default async function post(req, res) {
  const session = await getServerSession({ req, res }, authOptions);
  if (!session) {
    res.status(401).end();
    return;
  }

  switch (req.method) {
    case "GET": {
      const { postId, siteId, published } = req.query;
      if (postId) {
        // get individual post
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
        res.status(200).json(post);
      } else {
        // get all posts
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
        res.status(200).json({ posts, site });
      }
      return;
    }
    case "POST": {
      // create post
      const { siteId } = req.query;
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
      res.status(200).json({ postId: response.id });
      return;
    }
    case "DELETE": {
      // delete post
      const { postId } = req.query;
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
      await revalidate(
        `https://${response.site.subdomain}.vercel.pub`,
        response.slug
      ); // revalidate for subdomain
      if (response.site.customDomain)
        await revalidate(
          `https://${response.site.customDomain}`,
          response.slug
        ); // revalidate for custom domain
      res.status(200).end();
      return;
    }
    case "PUT": {
      // publish post, update post content, update post settings
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
      res.status(200).json(post);
    }
    default:
      res.status(405).end();
      return;
  }
}
