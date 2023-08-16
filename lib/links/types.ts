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
