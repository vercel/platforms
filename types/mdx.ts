import type { Post } from "@prisma/client";

export interface MdxCardData
  extends Pick<Post, "description" | "image" | "imageBlurhash"> {
  name: string | null;
  url: string | null;
}
