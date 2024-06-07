import { unstable_cache } from "next/cache";
import db from "./db";
import { and, desc, eq, not } from "drizzle-orm";
import { posts, sites, users } from "./schema";
import { serialize } from "next-mdx-remote/serialize";
import { replaceExamples, replaceTweets } from "@/lib/remark-plugins";

export async function getSiteData(domain: string) {
  const subdomain = domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`)
    ? domain.replace(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`, "")
    : null;

  return await unstable_cache(
    async () => {
      return await db.query.sites.findFirst({
        where: subdomain
          ? eq(sites.subdomain, subdomain)
          : eq(sites.customDomain, domain),
        with: {
          user: true,
        },
      });
    },
    [`${domain}-metadata`],
    {
      revalidate: 900,
      tags: [`${domain}-metadata`],
    },
  )();
}

export async function getPostsForSite(domain: string) {
  const subdomain = domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`)
    ? domain.replace(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`, "")
    : null;

  return await unstable_cache(
    async () => {
      return await db
        .select({
          title: posts.title,
          description: posts.description,
          slug: posts.slug,
          image: posts.image,
          imageBlurhash: posts.imageBlurhash,
          createdAt: posts.createdAt,
        })
        .from(posts)
        .leftJoin(sites, eq(posts.siteId, sites.id))
        .where(
          and(
            eq(posts.published, true),
            subdomain
              ? eq(sites.subdomain, subdomain)
              : eq(sites.customDomain, domain),
          ),
        )
        .orderBy(desc(posts.createdAt));
    },
    [`${domain}-posts`],
    {
      revalidate: 900,
      tags: [`${domain}-posts`],
    },
  )();
}

export async function getPostData(domain: string, slug: string) {
  const subdomain = domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`)
    ? domain.replace(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`, "")
    : null;

  return await unstable_cache(
    async () => {
      const data = await db
        .select({
          post: posts,
          site: sites,
          user: users,
        })
        .from(posts)
        .leftJoin(sites, eq(sites.id, posts.siteId))
        .leftJoin(users, eq(users.id, sites.userId))
        .where(
          and(
            eq(posts.slug, slug),
            eq(posts.published, true),
            subdomain
              ? eq(sites.subdomain, subdomain)
              : eq(sites.customDomain, domain),
          ),
        )
        .then((res) =>
          res.length > 0
            ? {
                ...res[0].post,
                site: res[0].site
                  ? {
                      ...res[0].site,
                      user: res[0].user,
                    }
                  : null,
              }
            : null,
        );

      if (!data) return null;

      const [mdxSource, adjacentPosts] = await Promise.all([
        getMdxSource(data.content!),
        db
          .select({
            slug: posts.slug,
            title: posts.title,
            createdAt: posts.createdAt,
            description: posts.description,
            image: posts.image,
            imageBlurhash: posts.imageBlurhash,
          })
          .from(posts)
          .leftJoin(sites, eq(sites.id, posts.siteId))
          .where(
            and(
              eq(posts.published, true),
              not(eq(posts.id, data.id)),
              subdomain
                ? eq(sites.subdomain, subdomain)
                : eq(sites.customDomain, domain),
            ),
          ),
      ]);

      return {
        ...data,
        mdxSource,
        adjacentPosts,
      };
    },
    [`${domain}-${slug}`],
    {
      revalidate: 900, // 15 minutes
      tags: [`${domain}-${slug}`],
    },
  )();
}

async function getMdxSource(postContents: string) {
  // transforms links like <link> to [link](link) as MDX doesn't support <link> syntax
  // https://mdxjs.com/docs/what-is-mdx/#markdown
  const content =
    postContents?.replaceAll(/<(https?:\/\/\S+)>/g, "[$1]($1)") ?? "";
  // Serialize the content string into MDX
  const mdxSource = await serialize(content, {
    mdxOptions: {
      remarkPlugins: [replaceTweets, () => replaceExamples(db)],
    },
  });

  return mdxSource;
}
