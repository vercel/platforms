import type { Post, Site, User } from "@prisma/client";

export interface AdjacentPost
  extends Pick<
    Post,
    "createdAt" | "description" | "image" | "imageBlurhash" | "slug" | "title"
  > {}

export interface _SiteData extends Site {
  user: User | null;
  posts: Array<Post>;
}

export interface _SiteSlugData extends Post {
  site: _SiteSite | null;
}

interface _SiteSite extends Site {
  user: User | null;
}
