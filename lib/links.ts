import crypto from "crypto";
import { UAParser } from "ua-parser-js";

import { DynamicLinkResponse } from "@/app/api/v1/shortLinks/route";
import prisma from "@/lib/prisma";

// https://firebase.google.com/docs/reference/dynamic-links/link-shortener
export type DynamicLinkInfo = {
  analyticsInfo?: {
    googlePlayAnalytics?: {
      utmCampaign?: string;
      utmContent?: string;
      utmMedium?: string;
      utmSource?: string;
      utmTerm?: string;
    };
    itunesConnectAnalytics?: {
      at?: string;
      ct?: string;
      mt?: string;
      pt?: string;
    };
  };
  androidInfo?: {
    androidFallbackLink?: string;
    androidMinPackageVersionCode?: string;
    androidPackageName: string;
  };

  domainUriPrefix: string;
  iosInfo?: {
    iosAppStoreId?: string;
    iosBundleId: string;
    iosCustomScheme?: string;
    iosFallbackLink?: string;
    iosIpadBundleId?: string;
    iosIpadFallbackLink?: string;
    iosMinimumVersion?: string;
  };
  link: string;
  navigationInfo?: {
    enableForcedRedirect: boolean;
  };
  otherPlatformInfo?: {
    otherPlatformFallbackLink: string;
  };
  socialMetaTagInfo?: {
    socialDescription?: string;
    socialImageLink?: string;
    socialTitle?: string;
  };
};

export type UrlType = "SHORT" | "UNGUESSABLE";
export type UrlSuffix = {
  option: UrlType;
};

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

/*
 * Possible 'os.name' (v1.x)
 * AIX, Amiga OS, Android, Arch, Bada, BeOS, BlackBerry, CentOS, Chromium OS, Contiki,
 * Fedora, Firefox OS, FreeBSD, Debian, DragonFly, Gentoo, GNU, Haiku, Hurd, iOS,
 * Joli, Linpus, Linux, Mac OS, Mageia, Mandriva, MeeGo, Minix, Mint, Morph OS, NetBSD,
 * Nintendo, OpenBSD, OpenVMS, OS/2, Palm, PCLinuxOS, Plan9, Playstation, QNX, RedHat,
 * RIM Tablet OS, RISC OS, Sailfish, Series40, Slackware, Solaris, SUSE, Symbian, Tizen,
 * Ubuntu, UNIX, VectorLinux, WebOS, Windows [Phone/Mobile], Zenwalk
 */
export function getFallbackUrl(
  info: DynamicLinkInfo,
  ua: UAParser.UAParserInstance,
) {
  const getBaseUrl = () => {
    switch (ua.getOS.name) {
      case "Android":
        return info.androidInfo?.androidFallbackLink
          ? info.androidInfo.androidFallbackLink
          : info.link;
      case "iOS":
        if (ua.getDevice().type === "mobile") {
          return info.iosInfo?.iosFallbackLink
            ? info.iosInfo.iosFallbackLink
            : info.link;
        } else if (ua.getDevice().type === "tablet") {
          return info.iosInfo?.iosIpadFallbackLink
            ? info.iosInfo.iosIpadFallbackLink
            : info.link;
        }
      case "Windows [Phone/Mobile]":
      case "Mac OS":
      case "Linux":
      default:
        // TODO; maybe break these 3 down into separate categories or added support for more OSes?
        return info.otherPlatformInfo?.otherPlatformFallbackLink
          ? info.otherPlatformInfo.otherPlatformFallbackLink
          : info.link;
    }
  };

  let fallbackUrl = getBaseUrl();

  if (info.analyticsInfo) {
    if (!fallbackUrl.includes("?")) {
      fallbackUrl += "?";
    }

    if (info?.analyticsInfo?.googlePlayAnalytics) {
      const { utmCampaign, utmContent, utmMedium, utmSource, utmTerm } =
        info.analyticsInfo.googlePlayAnalytics;
      const params = [
        utmCampaign ? `utm_campaign=${utmCampaign}` : null,
        utmContent ? `utm_content=${utmContent}` : null,
        utmMedium ? `utm_medium=${utmMedium}` : null,
        utmSource ? `utm_source=${utmSource}` : null,
        utmTerm ? `utm_term=${utmTerm}` : "",
      ]
        .filter((v) => v !== null)
        .join("&");

      if (!fallbackUrl.endsWith("?")) {
        fallbackUrl += "&";
      }
      fallbackUrl += params;
    }
    if (info?.analyticsInfo?.itunesConnectAnalytics) {
      const { at, ct, mt, pt } = info.analyticsInfo.itunesConnectAnalytics;
      const params = [
        at ? `at=${at}` : null,
        ct ? `ct=${ct}` : null,
        mt ? `mt=${mt}` : null,
        pt ? `pt=${pt}` : null,
      ]
        .filter((v) => v !== null)
        .join("&");

      if (!fallbackUrl.endsWith("?")) {
        fallbackUrl += "&";
      }
      fallbackUrl += params;
    }
  }

  return fallbackUrl;
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
