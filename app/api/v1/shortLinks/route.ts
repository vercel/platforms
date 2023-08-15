import { NextResponse } from "next/server";

import { generateDynamicLink } from "@/lib/links";

export type UrlType = "SHORT" | "UNGUESSABLE";
type UrlSuffix = {
  option: UrlType;
};

type LongDynamicLinkInfo = {
  longDynamicLink: string;
  suffix?: UrlSuffix;
};

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
  suffix?: UrlSuffix;
};

// https://firebase.google.com/docs/dynamic-links/create-manually
function parseLongDynamicLink(linkParams: LongDynamicLinkInfo) {
  const urlSearchParams = new URLSearchParams(linkParams.longDynamicLink);
  const params = Object.fromEntries(urlSearchParams.entries());

  let dynamicLinkInfo: DynamicLinkInfo = {
    domainUriPrefix: params.link.split("?")[0].split("/?")[0],
    link: params.link,
  };

  if (params.apn) {
    dynamicLinkInfo.androidInfo = {
      androidPackageName: params.apn,
    };
    if (params.afl) {
      dynamicLinkInfo.androidInfo.androidFallbackLink = params.afl;
    }
    if (params.apv) {
      dynamicLinkInfo.androidInfo.androidMinPackageVersionCode = params.apv;
    }
  }
  if (params.ibi) {
    dynamicLinkInfo.iosInfo = {
      iosBundleId: params.ibi,
    };
    if (params.ifl) {
      dynamicLinkInfo.iosInfo.iosFallbackLink = params.ifl;
    }
    if (params.ius) {
      dynamicLinkInfo.iosInfo.iosCustomScheme = params.ius;
    }
    if (params.ipfl) {
      dynamicLinkInfo.iosInfo.iosIpadFallbackLink = params.ipfl;
    }
    if (params.ipbi) {
      dynamicLinkInfo.iosInfo.iosIpadBundleId = params.ipbi;
    }
    if (params.isi) {
      dynamicLinkInfo.iosInfo.iosAppStoreId = params.isi;
    }
    if (params.imv) {
      dynamicLinkInfo.iosInfo.iosMinimumVersion = params.imv;
    }
    if (params.efr) {
      dynamicLinkInfo.navigationInfo = {
        enableForcedRedirect: params.efr === "1", // this may need to be a boolean
      };
    }
  }
  if (params.ofl) {
    dynamicLinkInfo.otherPlatformInfo = {
      otherPlatformFallbackLink: params.ofl,
    };
  }
  if (params.st || params.sd || params.si) {
    dynamicLinkInfo.socialMetaTagInfo = {};
    if (params.st) {
      dynamicLinkInfo.socialMetaTagInfo.socialTitle = params.st;
    }
    if (params.sd) {
      dynamicLinkInfo.socialMetaTagInfo.socialDescription = params.sd;
    }
    if (params.si) {
      dynamicLinkInfo.socialMetaTagInfo.socialImageLink = params.si;
    }
  }

  if (
    params.utm_source ||
    params.utm_medium ||
    params.utm_campaign ||
    params.utm_term ||
    params.utm_content
  ) {
    dynamicLinkInfo.analyticsInfo = {
      googlePlayAnalytics: {},
    };
    if (params.utm_source) {
      // @ts-ignore
      dynamicLinkInfo.analyticsInfo.googlePlayAnalytics.utmSource =
        params.utm_source;
    }
    if (params.utm_medium) {
      // @ts-ignore
      dynamicLinkInfo.analyticsInfo.googlePlayAnalytics.utmMedium =
        params.utm_medium;
    }
    if (params.utm_campaign) {
      // @ts-ignore
      dynamicLinkInfo.analyticsInfo.googlePlayAnalytics.utmCampaign =
        params.utm_campaign;
    }
    if (params.utm_term) {
      // @ts-ignore
      dynamicLinkInfo.analyticsInfo.googlePlayAnalytics.utmTerm =
        params.utm_term;
    }
    if (params.utm_content) {
      // @ts-ignore
      dynamicLinkInfo.analyticsInfo.googlePlayAnalytics.utmContent =
        params.utm_content;
    }
  }

  if (params.ct || params.at || params.mt || params.pt) {
    if (!dynamicLinkInfo.analyticsInfo) {
      dynamicLinkInfo.analyticsInfo = {};
    }
    dynamicLinkInfo.analyticsInfo.itunesConnectAnalytics = {};
    if (params.ct) {
      // @ts-ignore
      dynamicLinkInfo.analyticsInfo.itunesConnectAnalytics.ct = params.ct;
    }
    if (params.at) {
      // @ts-ignore
      dynamicLinkInfo.analyticsInfo.itunesConnectAnalytics.at = params.at;
    }
    if (params.mt) {
      // @ts-ignore
      dynamicLinkInfo.analyticsInfo.itunesConnectAnalytics.mt = params.mt;
    }
    if (params.pt) {
      // @ts-ignore
      dynamicLinkInfo.analyticsInfo.itunesConnectAnalytics.pt = params.pt;
    }
  }

  // TODO; support debug 'd' parameter
  // TODO; support suffix parameter

  return dynamicLinkInfo;
}

export type DynamicLinkResponse = {
  // TODO: add preview links
  previewLink: string;
  shortLink: string;
};

function paramsIsLongDynamicLinkInfo(
  params: LongDynamicLinkInfo | DynamicLinkInfo,
): params is LongDynamicLinkInfo {
  return (params as LongDynamicLinkInfo).longDynamicLink !== undefined;
}

function paramsIsDynamicLinkInfo(
  params: LongDynamicLinkInfo | DynamicLinkInfo,
): params is DynamicLinkInfo {
  return (params as DynamicLinkInfo).link !== undefined;
}

export async function POST(
  req: Request,
  { params }: { params: LongDynamicLinkInfo | DynamicLinkInfo },
) {
  // TODO: add apiKey query parameter check agianst database
  if (process.env.MULTITENANCY_MODE && !req.url.includes("apiKey=")) {
    return new Response("Unauthorized", { status: 401 });
  }

  // TODO; parse this from API Key
  const userId = "DEV_USER_ID";

  let parsed: DynamicLinkInfo;
  if (paramsIsLongDynamicLinkInfo(params)) {
    parsed = parseLongDynamicLink(params);
  } else if (paramsIsDynamicLinkInfo(params)) {
    parsed = params;
  } else {
    return new Response("Invalid params", { status: 400 });
  }

  try {
    return NextResponse.json(await generateDynamicLink(parsed, userId));
  } catch (err) {
    console.error("Error generating dynamic link", err);
    return new Response(JSON.stringify({ error: true }), { status: 500 });
  }
}
