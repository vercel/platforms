import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

export default async function site(req, res) {
  const session = await getServerSession({ req, res }, authOptions);
  if (!session) {
    res.status(401).end();
    return;
  }

  switch (req.method) {
    case "GET": {
      const { siteId } = req.query;
      if (siteId) {
        // get individual site
        const { siteId } = req.query;
        const settings = await prisma.site.findFirst({
          where: {
            id: siteId,
            user: {
              id: session.user.id,
            },
          },
        });
        res.status(200).json(settings);
      } else {
        // get all sites
        const sites = await prisma.site.findMany({
          where: {
            user: {
              id: session.user.id,
            },
          },
        });
        res.status(200).json(sites);
      }
      return;
    }
    case "POST": {
      // create site
      const { name, subdomain, description, userId } = req.body;
      const sub = subdomain.replace(/[^a-zA-Z0-9/-]+/g, "");

      const response = await prisma.site.create({
        data: {
          name: name,
          description: description,
          subdomain: sub.length > 0 ? sub : cuid(),
          logo: "/logo.png",
          image: `/placeholder.png`,
          imageBlurhash:
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAoJJREFUWEfFl4lu4zAMRO3cx/9/au6reMaOdkxTTl0grQFCRoqaT+SQotq2bV9N8rRt28xms87m83l553eZ/9vr9Wpkz+ezkT0ej+6dv1X81AFw7M4FBACPVn2c1Z3zLgDeJwHgeLFYdAARYioAEAKJEG2WAjl3gCwNYymQQ9b7/V4spmIAwO6Wy2VnAMikBWlDURBELf8CuN1uHQSrPwMAHK5WqwFELQ01AIXdAa7XawfAb3p6AOwK5+v1ugAoEq4FRSFLgavfQ49jAGQpAE5wjgGCeRrGdBArwHOPcwFcLpcGU1X0IsBuN5tNgYhaiFFwHTiAwq8I+O5xfj6fOz38K+X/fYAdb7fbAgFAjIJ6Aav3AYlQ6nfnDoDz0+lUxNiLALvf7XaDNGQ6GANQBKR85V27B4D3QQRw7hGIYlQKWGM79hSweyCUe1blXhEAogfABwHAXAcqSYkxCtHLUK3XBajSc4Dj8dilAeiSAgD2+30BAEKV4GKcAuDqB4TdYwBgPQByCgApUBoE4EJUGvxUjF3Q69/zLw3g/HA45ABKgdIQu+JPIyDnisCfAxAFNFM0EFNQ64gfS0EUoQP8ighrZSjn3oziZEQpauyKbfjbZchHUL/3AS/Dd30gAkxuRACgfO+EWQW8qwI1o+wseNuKcQiESjALvwNoMI0TcRzD4lFcPYwIM+JTF5x6HOs8yI7jeB5oKhpMRFH9UwaSCDB2Jmg4rc6E2TT0biIaG0rQhNqyhpHBcayTTSXH6vcDL7/sdqRK8LkwTsU499E8vRcAojHcZ4AxABdilgrp4lsXk8oVqgwh7+6H3phqd8J0Kk4vbx/+sZqCD/vNLya/5dT9fAH8g1WdNGgwbQAAAABJRU5ErkJggg==",
          user: {
            connect: {
              id: userId,
            },
          },
        },
      });
      res.status(200).json({ siteId: response.id });
      return;
    }
    case "DELETE": {
      // delete site
      const { siteId } = req.query;
      await prisma.$transaction([
        prisma.post.deleteMany({
          where: {
            site: {
              id: siteId,
            },
          },
        }),
        prisma.site.delete({
          where: {
            id: siteId,
          },
        }),
      ]);
      res.status(200).end();
      return;
    }
    case "PUT": {
      // save site settings
      let {
        id,
        currentSubdomain,
        name,
        description,
        subdomain,
        image,
        imageBlurhash,
      } = req.body;

      // processing subdomain
      const sub = subdomain.replace(/[^a-zA-Z0-9/-]+/g, "");
      subdomain = sub.length > 0 ? sub : currentSubdomain;

      // update site settings
      const response = await prisma.site.update({
        where: {
          id: id,
        },
        data: {
          name,
          description,
          subdomain,
          image,
          imageBlurhash,
        },
      });

      res.status(200).json(response);
    }
    default:
      res.status(405).end();
      return;
  }
}
