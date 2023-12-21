import { Organization, OrganizationPageLinks } from "@prisma/client";
import { AspectRatio } from "../../ui/aspect-ratio";
import Image from "next/image";
import SiteNav from "../../site-nav";
import SocialLandingPageFeed from "../social-media/social-landing-page-feed";
import { LineGradient } from "../../line-gradient";
import OrganizationPageLinksGrid from "../social-media/organization-page-links-grid";
import OrganizationPagePrimaryButton from "../social-media/organization-page-primary-button";
import EventsFeed from "../events-app/events-feed";
import BannerImage from "./banner-image";
import SocialHeaderMain from "./social-header-main";

export default async function SocialLandingPage({
  sitedata,
  params,
}: {
  sitedata: Organization & { pageLinks: OrganizationPageLinks[] };
  params: { domain: string };
}) {
  const domain = params.domain.replace("%3A", ":");

  let primaryPageLink: OrganizationPageLinks | undefined;
  const nonPrimaryPageLinks = sitedata.pageLinks.filter((pageLink) => {
    if (pageLink.isPrimary) {
      primaryPageLink = pageLink;
      return false;
    }
    return true;
  });

  return (
    <>
      <SiteNav params={{ domain: sitedata.subdomain as string }} />
      <div className="md:px-8 w-full max-w-5xl">
        <div className="flex flex-col items-center">
          <BannerImage
            src={sitedata?.image ?? undefined}
            blurDataURL={sitedata?.imageBlurhash ?? undefined}
            alt={sitedata.name ? sitedata.name : "Banner Image"}
          />
          <SocialHeaderMain
            logo={sitedata?.logo ?? undefined}
            name={sitedata?.name ?? undefined}
            description={sitedata?.description ?? undefined}
            primaryLink={primaryPageLink}
          />
        </div>
        <OrganizationPageLinksGrid pageLinks={nonPrimaryPageLinks} />
        {sitedata.subdomain === "vitalia" || sitedata.subdomain === "fora" ? (
          <EventsFeed domain={domain} />
        ) : (
          <SocialLandingPageFeed params={params} sitedata={sitedata} />
        )}
      </div>
    </>
  );
}
