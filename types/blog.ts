import type { Post, Site, User } from "@prisma/client";

export interface PostData {
  createdAt: string;
  description: string;
  image: string;
  imageBlurhash: string;
  slug: string;
  title: string;
}

export interface CardData {
  description: string;
  image: string;
  imageBlurhash: string;
  name: string;
  url: string;
}

export interface _SiteData extends Site {
  user: User | null;
  posts: Array<Post>;
}
