import crypto from "crypto";

import { DynamicLinkResponse } from "@/app/api/v1/shortLinks/route";
import prisma from "@/lib/prisma";

import { DynamicLinkInfo, UrlSuffix, UrlType } from "./types";

export async function generateDynamicLink(
  info: DynamicLinkInfo,
  userId: string,
  suffix?: UrlSuffix,
): Promise<DynamicLinkResponse> {
  const url = await getUniqueUrl(info.domainUriPrefix, userId, suffix?.option);

  await prisma.dynamicLink.create({
    data: {
      info,
      url,
      userId,
    },
  });
  return {
    previewLink: "",
    shortLink: url,
  };
}

async function getUniqueUrl(
  domainUriPrefix: string,
  userId: string,
  type: UrlType = "SHORT",
): Promise<string> {
  let bytesRequired = type === "SHORT" ? 2 : 9;

  // if we have too many links for a given length of url, increase the default length for the user
  const count = await prisma.dynamicLink.count({ where: { userId } });
  if (count > Math.pow(16, bytesRequired * 2) / 2) {
    bytesRequired += 1;
  }
  while (true) {
    let url = `${domainUriPrefix}/${crypto
      .randomBytes(bytesRequired)
      .toString("hex")}`;

    // default to 17 characters to align with firebase defaults for long links
    if (url.length === 18) {
      url = url.slice(0, -1);
    }
    if (!(await urlExists(url))) return url;
  }
}

async function urlExists(url: string): Promise<boolean> {
  const exists = await prisma.dynamicLink.findUnique({
    where: {
      url,
    },
  });

  return exists !== null;
}
