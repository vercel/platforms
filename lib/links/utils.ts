import { DynamicLinkInfo } from "./types";

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
